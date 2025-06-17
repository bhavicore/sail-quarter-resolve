
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';

type ComplaintRow = Database['public']['Tables']['complaints']['Row'];

type Complaint = ComplaintRow & {
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
};

type NewComplaint = Database['public']['Tables']['complaints']['Insert'];

export const useComplaints = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's complaints
  const { data: userComplaints = [], isLoading: userLoading } = useQuery({
    queryKey: ['complaints', 'user', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user');
      
      console.log('Fetching user complaints for:', user.id);
      const { data, error } = await supabase
        .from('complaints')
        .select(`
          *,
          profiles!inner (
            full_name,
            email
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user complaints:', error);
        throw error;
      }
      
      console.log('Fetched user complaints:', data);
      return (data || []) as Complaint[];
    },
    enabled: !!user?.id,
  });

  // Fetch all complaints (for admin)
  const { data: allComplaints = [], isLoading: allLoading } = useQuery({
    queryKey: ['complaints', 'all'],
    queryFn: async () => {
      console.log('Fetching all complaints');
      const { data, error } = await supabase
        .from('complaints')
        .select(`
          *,
          profiles!inner (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all complaints:', error);
        throw error;
      }
      
      console.log('Fetched all complaints:', data);
      return (data || []) as Complaint[];
    },
    enabled: !!user,
  });

  // Create complaint mutation
  const createComplaint = useMutation({
    mutationFn: async (newComplaint: Omit<NewComplaint, 'user_id'>) => {
      if (!user?.id) throw new Error('No user');
      
      console.log('Creating complaint:', newComplaint);
      const { data, error } = await supabase
        .from('complaints')
        .insert({
          ...newComplaint,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating complaint:', error);
        throw error;
      }
      
      console.log('Created complaint:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });

  // Update complaint status mutation
  const updateComplaintStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      console.log('Updating complaint status:', id, status);
      const { data, error } = await supabase
        .from('complaints')
        .update({ status: status as Database['public']['Enums']['complaint_status'] })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating complaint status:', error);
        throw error;
      }
      
      console.log('Updated complaint:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });

  return {
    userComplaints,
    allComplaints,
    complaints: allComplaints, // For backward compatibility
    isLoading: userLoading || allLoading,
    createComplaint,
    updateComplaintStatus,
    updateComplaint: updateComplaintStatus, // For backward compatibility
  };
};

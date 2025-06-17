
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type Complaint = Database['public']['Tables']['complaints']['Row'] & {
  profiles?: {
    full_name: string | null;
    email: string;
  };
};

type NewComplaint = Database['public']['Tables']['complaints']['Insert'];
type ComplaintUpdate = Database['public']['Tables']['complaints']['Update'];

export const useComplaints = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ['complaints'],
    queryFn: async () => {
      console.log('Fetching complaints...');
      const { data, error } = await supabase
        .from('complaints')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching complaints:', error);
        throw error;
      }
      console.log('Fetched complaints:', data);
      return data as Complaint[];
    },
  });

  const createComplaintMutation = useMutation({
    mutationFn: async (complaint: NewComplaint) => {
      console.log('Creating complaint:', complaint);
      const { data, error } = await supabase
        .from('complaints')
        .insert([complaint])
        .select()
        .single();

      if (error) {
        console.error('Error creating complaint:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      toast({ title: 'Success', description: 'Complaint created successfully!' });
    },
    onError: (error) => {
      console.error('Create complaint error:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to create complaint. Please try again.',
        variant: 'destructive'
      });
    },
  });

  const updateComplaintMutation = useMutation({
    mutationFn: async ({ id, ...updates }: ComplaintUpdate & { id: string }) => {
      console.log('Updating complaint:', id, updates);
      const { data, error } = await supabase
        .from('complaints')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating complaint:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      toast({ title: 'Success', description: 'Complaint updated successfully!' });
    },
    onError: (error) => {
      console.error('Update complaint error:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to update complaint. Please try again.',
        variant: 'destructive'
      });
    },
  });

  return {
    complaints,
    isLoading,
    createComplaint: createComplaintMutation.mutate,
    updateComplaint: updateComplaintMutation.mutate,
    isCreating: createComplaintMutation.isPending,
    isUpdating: updateComplaintMutation.isPending,
  };
};

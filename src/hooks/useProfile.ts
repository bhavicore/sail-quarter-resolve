
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useProfile = () => {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user');
      
      console.log('Fetching profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      console.log('Fetched profile:', data);
      return data as Profile;
    },
    enabled: !!user?.id,
  });

  return { profile, isLoading };
};

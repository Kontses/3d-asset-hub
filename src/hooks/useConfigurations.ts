import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as configurationsService from '@/services/configurations';
import { toast } from '@/hooks/use-toast';
import { Configuration } from '@/types/configuration';

export function useConfigurations(productId?: string) {
  return useQuery({
    queryKey: ['configurations', productId],
    queryFn: () => configurationsService.getConfigurations(productId),
  });
}

export function useConfiguration(id: string) {
  return useQuery({
    queryKey: ['configurations', id],
    queryFn: () => configurationsService.getConfiguration(id),
    enabled: !!id,
  });
}

export function useConfigurationByToken(shareToken: string) {
  return useQuery({
    queryKey: ['configurations', 'token', shareToken],
    queryFn: () => configurationsService.getConfigurationByToken(shareToken),
    enabled: !!shareToken,
  });
}

export function useCreateConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (config: Omit<Configuration, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'share_token'>) =>
      configurationsService.createConfiguration(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
      toast({
        title: "Success",
        description: "Configuration created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Configuration> }) =>
      configurationsService.updateConfiguration(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
      toast({
        title: "Success",
        description: "Configuration updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => configurationsService.deleteConfiguration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
      toast({
        title: "Success",
        description: "Configuration deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useToggleConfigurationPublic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isPublic }: { id: string; isPublic: boolean }) =>
      configurationsService.toggleConfigurationPublic(id, isPublic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
      toast({
        title: "Success",
        description: "Configuration visibility updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

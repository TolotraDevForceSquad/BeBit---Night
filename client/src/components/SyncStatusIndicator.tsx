import React from 'react';
import { useOfflineSync } from '../hooks/use-offline-sync';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw, CloudOff, Check, AlertCircle } from 'lucide-react';

interface SyncStatusIndicatorProps {
  compact?: boolean;
}

export function SyncStatusIndicator({ compact = false }: SyncStatusIndicatorProps) {
  const {
    isOnline,
    syncStatus,
    pendingChanges,
    formatLastSyncTime,
    syncNow,
  } = useOfflineSync();

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative inline-flex">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => syncNow()}
                disabled={syncStatus === 'syncing' || !isOnline}
              >
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-amber-500" />
                )}

                {pendingChanges > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px]"
                    variant="destructive"
                  >
                    {pendingChanges > 9 ? '9+' : pendingChanges}
                  </Badge>
                )}
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="text-xs">
              <div className="font-semibold mb-1">
                Statut de synchronisation
              </div>
              <div className="mb-1">
                {isOnline ? 'En ligne' : 'Hors ligne'}
                {isOnline && syncStatus === 'syncing' && ' (Synchronisation en cours...)'}
              </div>
              {pendingChanges > 0 && (
                <div className="text-amber-500">
                  {pendingChanges} modification{pendingChanges > 1 ? 's' : ''} en attente
                </div>
              )}
              <div className="text-muted-foreground">
                Dernière synchronisation: {formatLastSyncTime()}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {syncStatus === 'syncing' ? (
          <RefreshCw className="h-4 w-4 animate-spin text-primary" />
        ) : isOnline ? (
          <Wifi className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-amber-500" />
        )}
        
        <span className="text-sm font-medium">
          {isOnline ? (
            syncStatus === 'syncing' ? 'Synchronisation...' : 'En ligne'
          ) : (
            'Hors ligne'
          )}
        </span>
      </div>

      {isOnline && pendingChanges > 0 && (
        <Badge variant="outline" className="gap-1 text-amber-500 border-amber-300 bg-amber-100/50 dark:bg-amber-900/30">
          <CloudOff className="h-3 w-3" />
          {pendingChanges} en attente
        </Badge>
      )}

      {isOnline && syncStatus === 'error' && (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Erreur de synchronisation
        </Badge>
      )}

      {isOnline && syncStatus !== 'syncing' && (
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1 text-xs"
          onClick={() => syncNow()}
        >
          <RefreshCw className="h-3 w-3" />
          Synchroniser
        </Button>
      )}

      <span className="text-xs text-muted-foreground">
        Dernière synchronisation: {formatLastSyncTime()}
      </span>
    </div>
  );
}
const handleSaveDevice = useCallback(async (deviceData: POSDevice) => {
  try {
    setIsLoading(true);

    let normalizedLastActive: string | null = null;
    if (deviceData.lastActive) {
      const dateObj = new Date(deviceData.lastActive);
      if (!isNaN(dateObj.getTime())) {
        normalizedLastActive = dateObj.toISOString();
      } else {
        console.warn('Date invalide détectée pour lastActive, mise à null');
        normalizedLastActive = null;
      }
    }

    let updatedDevice: POSDevice;

    if (deviceData.id) {
      // Mise à jour d'un appareil existant - inclure tous les champs
      const dataToSend = {
        id: deviceData.id,
        name: deviceData.name,
        location: deviceData.location,
        status: deviceData.status,
        sales: deviceData.sales || 0,
        last_active: normalizedLastActive
      };

      updatedDevice = await api.updatePosDevice(deviceData.id, dataToSend);
      const updatedDevices = devices.map(d => d.id === deviceData.id ? updatedDevice : d);
      setDevices(updatedDevices);

      toast({
        title: "Terminal mis à jour",
        description: `Le terminal "${deviceData.name}" a été mis à jour avec succès.`,
        variant: "default",
      });
    } else {
      // Pour un nouveau device - ne pas inclure id et last_active
      const dataToSend = {
        name: deviceData.name,
        location: deviceData.location,
        status: deviceData.status,
        sales: deviceData.sales || 0,
        // Ne pas inclure last_active pour les nouveaux devices
      };

      updatedDevice = await api.createPosDevice(dataToSend);
      setDevices([...devices, updatedDevice]);

      toast({
        title: "Terminal ajouté",
        description: `Le terminal "${deviceData.name}" a été ajouté avec succès.`,
        variant: "default",
      });
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    console.error('Détails de l\'erreur:', error.response?.data || error.message);
    
    toast({
      title: "Erreur",
      description: "Impossible de sauvegarder le terminal",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
}, [devices, toast]);
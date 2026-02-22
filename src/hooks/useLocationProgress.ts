import { useEffect, useState } from "react";
import { apClient } from "../archipelago/client";

export interface LocationProgress {
  checked: number;
  total: number;
}

export function useLocationProgress(isConnected: boolean): LocationProgress {
  const [checked, setChecked] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isConnected) {
      setChecked(0);
      setTotal(0);
      return;
    }

    // Read initial values after connection
    setChecked(apClient.room.checkedLocations.length);
    setTotal(apClient.room.allLocations.length);

    const onLocationsChecked = () => {
      setChecked(apClient.room.checkedLocations.length);
      setTotal(apClient.room.allLocations.length);
    };

    apClient.room.on("locationsChecked", onLocationsChecked);

    return () => {
      apClient.room.off("locationsChecked", onLocationsChecked);
    };
  }, [isConnected]);

  return { checked, total };
}

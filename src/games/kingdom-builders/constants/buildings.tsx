import React from 'react';
import { 
  HomeIcon, 
  Church, 
  Warehouse, 
  Flower2 
} from 'lucide-react';
import type { BuildingType, BuildingData } from '../types';

export const BUILDINGS: Record<BuildingType, BuildingData> = {
  house: {
    type: 'house',
    icon: <HomeIcon className="w-6 h-6" />,
    cost: 100,
    points: 10,
    description: 'Provides shelter for your citizens'
  },
  church: {
    type: 'church',
    icon: <Church className="w-6 h-6" />,
    cost: 300,
    points: 30,
    description: 'A place of worship and community'
  },
  garden: {
    type: 'garden',
    icon: <Flower2 className="w-6 h-6" />,
    cost: 50,
    points: 5,
    description: 'Grows food and provides beauty'
  },
  workshop: {
    type: 'workshop',
    icon: <Warehouse className="w-6 h-6" />,
    cost: 200,
    points: 20,
    description: 'Produces resources and tools'
  }
};
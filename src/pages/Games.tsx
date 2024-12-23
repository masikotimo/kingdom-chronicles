import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Ship, Theater } from 'lucide-react';

const games = [
  {
    id: 'kingdom-builders',
    title: 'Kingdom Builders',
    description: 'Build and manage your Biblical kingdom with wisdom and strategy',
    icon: <Building2 className="w-12 h-12 text-indigo-600" />,
    difficulty: 'Medium',
    players: '1-4'
  },
  {
    id: 'ark-escape',
    title: 'Ark Escape',
    description: 'Race against time to gather resources and build Noah\'s ark',
    icon: <Ship className="w-12 h-12 text-indigo-600" />,
    difficulty: 'Easy',
    players: '1-2'
  },
  {
    id: 'bible-charades',
    title: 'Bible Charades',
    description: 'Act out and guess Biblical stories in this exciting team game',
    icon: <Theater className="w-12 h-12 text-indigo-600" />,
    difficulty: 'Easy',
    players: '4-12'
  }
];

export const Games: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Games</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map(game => (
          <Link
            key={game.id}
            to={`/games/${game.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                {game.icon}
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900">{game.title}</h2>
                  <p className="text-sm text-gray-500">
                    {game.difficulty} • {game.players} Players
                  </p>
                </div>
              </div>
              <p className="text-gray-600">{game.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
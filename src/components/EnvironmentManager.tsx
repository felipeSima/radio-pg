import React, { useState } from 'react';
import { Environment } from '../types/audio';

interface EnvironmentManagerProps {
  environments: Environment[];
  activeEnvironment: Environment | null;
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

const EnvironmentManager: React.FC<EnvironmentManagerProps> = ({
  environments,
  activeEnvironment,
  onSave,
  onLoad,
  onDelete,
}) => {
  const [newEnvironmentName, setNewEnvironmentName] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEnvironmentName.trim()) {
      onSave(newEnvironmentName.trim());
      setNewEnvironmentName('');
      setIsFormOpen(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-secondary rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medieval text-xl text-white">Ambientes Sonoros</h2>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="btn btn-primary text-sm"
        >
          {isFormOpen ? 'Cancelar' : 'Novo Ambiente'}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSave} className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newEnvironmentName}
              onChange={(e) => setNewEnvironmentName(e.target.value)}
              placeholder="Nome do ambiente"
              className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button type="submit" className="btn btn-accent">
              Salvar
            </button>
          </div>
        </form>
      )}

      {environments.length === 0 ? (
        <p className="text-gray-400 text-center py-4">
          Nenhum ambiente salvo. Crie um novo ambiente para começar.
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {environments.map((env) => (
            <div
              key={env.id}
              className={`p-3 rounded-lg transition-colors ${
                activeEnvironment?.id === env.id
                  ? 'bg-primary-dark'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medieval font-bold">{env.name}</h3>
                  <p className="text-xs text-gray-400">
                    {formatDate(env.createdAt)} • {env.tracks.length} faixas
                  </p>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => onLoad(env.id)}
                    className="p-1.5 rounded-md bg-primary bg-opacity-20 hover:bg-opacity-40 transition-colors"
                    aria-label="Carregar ambiente"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(env.id)}
                    className="p-1.5 rounded-md bg-red-500 bg-opacity-20 hover:bg-opacity-40 transition-colors"
                    aria-label="Excluir ambiente"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnvironmentManager;

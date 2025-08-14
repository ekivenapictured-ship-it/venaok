
import React, { useState } from 'react';
import { migrateMockData } from '../scripts/migrate-mock-data';

const DataMigration: React.FC = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string>('');

  const handleMigration = async () => {
    setIsMigrating(true);
    setMigrationStatus('Starting migration...');
    
    try {
      await migrateMockData();
      setMigrationStatus('Migration completed successfully!');
    } catch (error) {
      setMigrationStatus(`Migration failed: ${error}`);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="p-6 bg-brand-surface rounded-lg">
      <h2 className="text-xl font-bold mb-4">Database Migration</h2>
      <p className="mb-4 text-brand-text-secondary">
        Click the button below to migrate mock data to your Supabase database. 
        This should only be done once when setting up the system.
      </p>
      
      <button 
        onClick={handleMigration}
        disabled={isMigrating}
        className="button-primary mb-4"
      >
        {isMigrating ? 'Migrating...' : 'Migrate Mock Data to Database'}
      </button>
      
      {migrationStatus && (
        <div className={`p-3 rounded ${migrationStatus.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {migrationStatus}
        </div>
      )}
    </div>
  );
};

export default DataMigration;

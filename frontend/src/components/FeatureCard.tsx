import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  supported: boolean;
  children: React.ReactNode;
}

export function FeatureCard({ title, description, supported, children }: FeatureCardProps) {
  return (
    <div className={`feature-card ${supported ? '' : 'unsupported'}`}>
      <div className="card-header">
        <h3>{title}</h3>
        <span className={`badge ${supported ? 'badge-supported' : 'badge-unsupported'}`}>
          {supported ? 'Unterstützt' : 'Nicht unterstützt'}
        </span>
      </div>
      <p className="card-description">{description}</p>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

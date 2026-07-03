import React from 'react';

export const SkeletonBox = ({ width = '100%', height = '20px', borderRadius = '8px', style = {} }) => (
  <div
    className="skeleton-shimmer"
    style={{
      width,
      height,
      borderRadius,
      ...style,
    }}
  />
);

export const SkeletonCard = ({ count = 3 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', margin: '20px 0' }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="glass" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <SkeletonBox width="40%" height="16px" />
          <SkeletonBox width="36px" height="36px" borderRadius="50%" />
        </div>
        <SkeletonBox width="60%" height="32px" style={{ marginBottom: '12px' }} />
        <SkeletonBox width="80%" height="14px" />
      </div>
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="table-container" style={{ padding: '16px' }}>
    <div style={{ display: 'flex', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
      {Array.from({ length: cols }).map((_, c) => (
        <SkeletonBox key={c} width={`${100 / cols}%`} height="18px" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
        {Array.from({ length: cols }).map((_, c) => (
          <SkeletonBox key={c} width={`${100 / cols}%`} height="16px" />
        ))}
      </div>
    ))}
  </div>
);

export default SkeletonBox;

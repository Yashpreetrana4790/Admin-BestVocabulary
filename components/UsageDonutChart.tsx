'use client';

import { useState } from 'react';

interface UsageDonutChartProps {
  usageDistribution?: {
    spoken: number;
    written: number;
  };
  commonUsage?: Array<{
    context: string;
    example?: string;
  }>;
  size?: number; // Size of the chart in pixels
}

const UsageDonutChart = ({ 
  usageDistribution, 
  commonUsage,
  size = 40 
}: UsageDonutChartProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Priority 1: If we have usage distribution (spoken/written), use that
  if (usageDistribution && (usageDistribution.spoken || usageDistribution.written)) {
    const spoken = usageDistribution.spoken || 0;
    const written = usageDistribution.written || 0;
    const total = spoken + written;

    if (total === 0) {
      // Show placeholder if no data
      return (
        <div className="relative" style={{ width: size, height: size }}>
          <div className="h-full w-full rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
            <span className="text-[10px] text-gray-400">N/A</span>
          </div>
        </div>
      );
    }

    const spokenPercentage = (spoken / total) * 100;
    const writtenPercentage = (written / total) * 100;

    const strokeWidth = size <= 40 ? 4 : 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    // Calculate dash array for spoken segment
    const spokenDash = (spokenPercentage / 100) * circumference;
    const writtenDash = (writtenPercentage / 100) * circumference;

    return (
      <div 
        className="relative group"
        style={{ width: size, height: size }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Spoken segment - starts from top */}
          {spoken > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={strokeWidth}
              strokeDasharray={`${spokenDash} ${circumference}`}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
          )}
          {/* Written segment - continues after spoken */}
          {written > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth={strokeWidth}
              strokeDasharray={`${writtenDash} ${circumference}`}
              strokeDashoffset={-spokenDash}
              strokeLinecap="round"
            />
          )}
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className={`${size <= 40 ? 'text-[8px]' : 'text-[10px]'} font-semibold text-gray-600 dark:text-gray-400`}>
            {Math.round(spokenPercentage)}%
          </span>
        </div>
        {/* Tooltip on hover */}
        {isHovered && (
          <div className="absolute left-0 top-full mt-2 bg-gray-900 text-white text-xs rounded-md px-2 py-1.5 whitespace-nowrap z-[9999] shadow-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Spoken: {spokenPercentage.toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span>Written: {writtenPercentage.toFixed(0)}%</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Priority 2: If we have common usage contexts, show distribution
  if (commonUsage && commonUsage.length > 0) {
    // Group by context and count
    const contextCounts: Record<string, number> = {};
    commonUsage.forEach((usage) => {
      if (usage.context) {
        contextCounts[usage.context] = (contextCounts[usage.context] || 0) + 1;
      }
    });

    const contexts = Object.keys(contextCounts);
    if (contexts.length === 0) {
      return (
        <div className="relative" style={{ width: size, height: size }}>
          <div className="h-full w-full rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
            <span className="text-[10px] text-gray-400">N/A</span>
          </div>
        </div>
      );
    }

    const total = Object.values(contextCounts).reduce((sum, count) => sum + count, 0);
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

    const strokeWidth = size <= 40 ? 4 : 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    // Build segments
    const segments: Array<{ percentage: number; color: string; context: string }> = [];
    contexts.forEach((context, index) => {
      segments.push({
        percentage: (contextCounts[context] / total) * 100,
        color: colors[index % colors.length],
        context
      });
    });

    let currentOffset = 0;

    return (
      <div 
        className="relative group"
        style={{ width: size, height: size }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Context segments */}
          {segments.map((segment, index) => {
            const dashLength = (segment.percentage / 100) * circumference;
            const offset = -currentOffset;
            currentOffset += dashLength;

            return (
              <circle
                key={`${segment.context}-${index}`}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${circumference}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        {/* Center label - show number of contexts */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className={`${size <= 40 ? 'text-[8px]' : 'text-[10px]'} font-semibold text-gray-600 dark:text-gray-400`}>
            {contexts.length}
          </span>
        </div>
        {/* Tooltip on hover */}
        {isHovered && (
          <div className="absolute left-0 top-full mt-2 bg-gray-900 text-white text-xs rounded-md px-2 py-1.5 z-[9999] shadow-lg max-w-[150px]">
            {segments.map((segment, index) => (
              <div key={segment.context} className="flex items-center gap-2 mb-1 last:mb-0">
                <div 
                  className="w-2 h-2 rounded-full shrink-0" 
                  style={{ backgroundColor: segment.color }}
                ></div>
                <span className="truncate">{segment.context}: {segment.percentage.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default: show placeholder
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="h-full w-full rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
        <span className="text-[10px] text-gray-400">N/A</span>
      </div>
    </div>
  );
};

export default UsageDonutChart;


import React, { useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface DownloadableChartProps {
  filename: string;
  children: React.ReactNode;
  downloadType?: 'svg' | 'png';
}

const DownloadableChart: React.FC<DownloadableChartProps> = ({ 
  filename, 
  children, 
  downloadType = 'png' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(() => {
    if (!containerRef.current) return;
    
    // Find the SVG element within our container
    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) {
      console.error('SVG element not found');
      return;
    }

    // Create a clone of the SVG to avoid modifying the original
    const clonedSvg = svgElement.cloneNode(true) as SVGElement;
    
    if (downloadType === 'png') {
      // For PNG export
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      // Get SVG dimensions
      const svgRect = svgElement.getBoundingClientRect();
      canvas.width = svgRect.width;
      canvas.height = svgRect.height;
      
      // Create an image from the SVG
      const image = new Image();
      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      image.onload = () => {
        if (context) {
          // Draw white background (charts often have transparent backgrounds)
          context.fillStyle = '#FFFFFF';
          context.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw the SVG on the canvas
          context.drawImage(image, 0, 0);
          
          // Convert canvas to PNG and trigger download
          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = `${filename}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
        URL.revokeObjectURL(url);
      };
      
      image.src = url;
    } else {
      // For SVG export
      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `${filename}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    }
  }, [filename, downloadType]);

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {children}
    <div className="absolute top-2 right-2 z-10 opacity-30 hover:opacity-100 transition-opacity">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="bg-white/60 hover:bg-white/80"
      >
        Download {downloadType.toUpperCase()}
      </Button>
    </div>
    </div>
  );
};

export default DownloadableChart;
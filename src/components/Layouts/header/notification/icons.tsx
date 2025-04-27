import { SVGProps } from "react";

export function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 1.042A6.458 6.458 0 003.542 7.5v.587c0 .58-.172 1.148-.495 1.631l-.957 1.436a2.934 2.934 0 001.67 4.459c.63.171 1.264.316 1.903.435l.002.005c.64 1.71 2.353 2.905 4.335 2.905 1.982 0 3.694-1.196 4.335-2.905l.002-.005a23.736 23.736 0 001.903-.435 2.934 2.934 0 001.67-4.459l-.958-1.436a2.941 2.941 0 01-.494-1.631V7.5A6.458 6.458 0 0010 1.042zm2.813 15.239a23.71 23.71 0 01-5.627 0c.593.85 1.623 1.427 2.814 1.427 1.19 0 2.221-.576 2.813-1.427zM4.792 7.5a5.208 5.208 0 1110.416 0v.587c0 .827.245 1.636.704 2.325l.957 1.435c.638.957.151 2.257-.958 2.56a22.467 22.467 0 01-11.822 0 1.684 1.684 0 01-.959-2.56l.958-1.435a4.192 4.192 0 00.704-2.325V7.5z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CheckCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm5.09 7.714a.998.998 0 00-1.414-1.414l-4.243 4.243-2.122-2.122a.998.998 0 00-1.414 1.414l3 3a.997.997 0 001.414 0l5-5z"
        fill="currentColor"
      />
    </svg>
  );
}

export function XCircle(props: SVGProps<SVGSVGElement>) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M9.172 14.828L12 12.001l2.828 2.828L14.828 12l2.828-2.828L12 9.172l-2.828 2.828L9.172 12l-2.828-2.828L12 6.343l2.828 2.828L14.828 12l2.828 2.828z" fill="currentColor"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" fill="currentColor"/>
        </svg>
    )
}

import { SVGProps } from "react";

export type PropsType = SVGProps<SVGSVGElement>;

export function DashboardIcon(props: PropsType) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.5 3.75a.75.75 0 00-.75.75v5.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-5.5a.75.75 0 00-.75-.75h-5.5zm0 10a.75.75 0 00-.75.75v5.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-5.5a.75.75 0 00-.75-.75h-5.5zm9.25-9.25a.75.75 0 01.75-.75h5.5a.75.75 0 01.75.75v5.5a.75.75 0 01-.75.75h-5.5a.75.75 0 01-.75-.75v-5.5zm.75 9.25a.75.75 0 00-.75.75v5.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-5.5a.75.75 0 00-.75-.75h-5.5z"
      />
    </svg>
  );
}

export function LeavesIcon(props: PropsType) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.5c-3.254 0-5.465.973-6.799 2.81C3.847 7.172 3.5 10.088 3.5 14c0 .995.223 1.878.566 2.643.347.776.84 1.417 1.45 1.927.582.486 1.257.86 1.984 1.115V20.5a1 1 0 001 1h7a1 1 0 001-1v-.815c.727-.254 1.402-.629 1.984-1.115.61-.51 1.103-1.151 1.45-1.927.343-.765.566-1.648.566-2.643 0-3.912-.347-6.828-1.701-8.69C17.465 3.473 15.254 2.5 12 2.5zm-2.5 18v-1.023a14.561 14.561 0 002.5.223c.85 0 1.687-.075 2.5-.223V20.5h-5zm6.412-3.243a12.65 12.65 0 01-3.912.643c-2.96 0-5.157-.97-6.5-2.67C9.037 14.978 10.775 16 13 16c.343 0 .673-.024.988-.069a.75.75 0 00.64-.871.748.748 0 00-.872-.642A6.41 6.41 0 0113 14.5c-1.879 0-3.256-.71-4.113-1.804-.88-1.117-1.065-2.573-1.066-3.936 0-2.123.406-3.691 1.095-4.766.7-1.095 1.809-1.774 3.584-1.961a.75.75 0 00.656-.837.75.75 0 00-.836-.657C9.934 1.756 8.42 2.641 7.463 4.097 6.495 5.573 6 7.5 6 10c0 2.5.5 4.5 1.5 6 .826 1.239 2 2.064 3.412 2.526A5.77 5.77 0 0113 17.5c1.4 0 2.596-.301 3.588-.826 1.41-.747 2.235-1.962 2.235-3.674 0-2.5-.667-4.145-1.731-5.209-.528-.528-1.142-.891-1.842-1.125a.75.75 0 00-.5 1.414c.498.176.908.431 1.269.792.78.78 1.304 2 1.304 4.128 0 1.262-.565 2.052-1.559 2.574z"
      />
    </svg>
  );
}

export function FeedsIcon(props: PropsType) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.75 4a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15A.75.75 0 013.75 4zm0 5a.75.75 0 01.75-.75h10a.75.75 0 010 1.5h-10A.75.75 0 013.75 9zm0 5a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm.75 4.25a.75.75 0 000 1.5h10a.75.75 0 000-1.5h-10z"
      />
      <path
        d="M19.25 8a.75.75 0 00-1.5 0v1.25H16.5a.75.75 0 000 1.5h1.25V12a.75.75 0 001.5 0v-1.25H20.5a.75.75 0 000-1.5h-1.25V8z"
      />
    </svg>
  );
}

export function InventoryIcon(props: PropsType) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.25 4A.75.75 0 015 3.25h14a.75.75 0 01.75.75v16a.75.75 0 01-.75.75H5a.75.75 0 01-.75-.75V4zm1.5.75v14.5h12.5V4.75H5.75z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.25 8c0-.414.336-.75.75-.75h16a.75.75 0 010 1.5H4A.75.75 0 013.25 8zm0 8c0-.414.336-.75.75-.75h16a.75.75 0 010 1.5H4a.75.75 0 01-.75-.75z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 7.25a.75.75 0 01.75.75v8a.75.75 0 01-1.5 0V8a.75.75 0 01.75-.75z"
      />
    </svg>
  );
}

export function StocksIcon(props: PropsType) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.25 5a.75.75 0 01.75-.75h16a.75.75 0 010 1.5H4A.75.75 0 013.25 5zm0 14a.75.75 0 01.75-.75h16a.75.75 0 010 1.5H4a.75.75 0 01-.75-.75z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.5 4.25a.75.75 0 01.75.75v14a.75.75 0 01-1.5 0V5a.75.75 0 01.75-.75zm13 0a.75.75 0 01.75.75v14a.75.75 0 01-1.5 0V5a.75.75 0 01.75-.75z"
      />
      <path
        d="M12.53 7.22a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06L12 8.81l2.47 2.47a.75.75 0 101.06-1.06l-3-3z"
      />
      <path
        d="M9.47 16.78a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06L10 15.19l-2.47-2.47a.75.75 0 10-1.06 1.06l3 3z"
      />
    </svg>
  );
}

export function IllnessIcon(props: PropsType) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zM2 12a10 10 0 1120 0 10 10 0 01-20 0z"
      />
      <path
        d="M11 8a1 1 0 112 0v4a1 1 0 11-2 0V8z"
      />
      <path
        d="M12 16a1 1 0 100-2 1 1 0 000 2z"
      />
    </svg>
  );
}

export function TreatmentIcon(props: PropsType) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.87 2.17a.75.75 0 00-1.49.16l.25 2.24a3.75 3.75 0 01-3.34 4.16l-2.24.25a.75.75 0 00-.16 1.49l2.24.25a3.75 3.75 0 013.34 4.16l-.25 2.24a.75.75 0 001.49.16l.25-2.24a3.75 3.75 0 014.16-3.34l2.24.25a.75.75 0 00.16-1.49l-2.24-.25a3.75 3.75 0 01-3.34-4.16l.25-2.24a.75.75 0 00-.16-1.49l-1.21.14zm3.38 7.93a5.25 5.25 0 00-4.68-4.68l.1-.95.95-.1a5.25 5.25 0 004.68 4.68l-.1.95-.95.1z"
      />
      <path
        d="M7.5 15.75a.75.75 0 100 1.5h.75v.75a.75.75 0 001.5 0v-.75h.75a.75.75 0 000-1.5h-.75V15a.75.75 0 00-1.5 0v.75H7.5z"
      />
    </svg>
  );
}

export function PatientHistoryIcon(props: PropsType) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 3.5a.75.75 0 01.75-.75h6.5a.75.75 0 010 1.5h-6.5A.75.75 0 018 3.5z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.75 2.75A.75.75 0 008 3.5v3.75a.75.75 0 001.5 0V3.5a.75.75 0 00-.75-.75zm6.5 0a.75.75 0 00-.75.75v3.75a.75.75 0 001.5 0V3.5a.75.75 0 00-.75-.75z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.75 7.25A2.75 2.75 0 003 10v8.25A2.75 2.75 0 005.75 21h12.5A2.75 2.75 0 0021 18.25V10a2.75 2.75 0 00-2.75-2.75H5.75zM4.5 10a1.25 1.25 0 011.25-1.25h12.5A1.25 1.25 0 0119.5 10v8.25a1.25 1.25 0 01-1.25 1.25H5.75a1.25 1.25 0 01-1.25-1.25V10z"
      />
      <path
        d="M7 12a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1z"
      />
      <path
        d="M7 16a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
      />
      <path
        d="M15 17a2 2 0 100-4 2 2 0 000 4z"
      />
    </svg>
  );
}
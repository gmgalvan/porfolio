"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './fancy-redirect.module.scss';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/en');
  }, [router]);

  // Generate dots for the spinner
  const renderDots = () => {
    return Array.from({ length: 12 }).map((_, index) => (
      <div key={index} className={styles.spinner__dot}></div>
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}>
          {renderDots()}
        </div>
      </div>
    </div>
  );
}
import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main className="container mx-auto mt-10">{children}</main>
      <Footer />
    </>
  );
}

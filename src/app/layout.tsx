import './globals.css'; // Importez le fichier CSS global ici
import React from 'react'; // Assurez-vous que React est importé

export const metadata = {
  title: 'Todo List - Clean Architecture',
  description: 'A Todo List application built with Next.js and Clean Architecture',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
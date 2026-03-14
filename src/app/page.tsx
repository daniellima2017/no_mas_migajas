import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg-primary p-8">
      <h1 className="text-2xl font-bold text-white">No Mas Migajas</h1>
      <div className="flex gap-4">
        <Button className="bg-btn-primary text-black hover:bg-white/90">Principal</Button>
        <Button className="bg-btn-panic text-white hover:bg-red-700">Panico</Button>
      </div>
      <Card className="w-80 bg-bg-card border-border-default">
        <CardHeader>
          <CardTitle className="text-accent-gold">Tarjeta Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Contenido de prueba</p>
          <p className="text-accent-red mt-2">Alerta roja</p>
        </CardContent>
      </Card>
      <div className="rounded-lg border border-border-danger bg-bg-danger p-4">
        <p className="text-sm text-white">Zona de peligro</p>
      </div>
      <p className="font-mono text-sm text-white">Geist Mono Test</p>
    </div>
  );
}
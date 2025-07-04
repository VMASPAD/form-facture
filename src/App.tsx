
import { Link } from "react-router";
import "./App.css";
import { motion } from "motion/react";
import { Button } from "./components/ui/button";

function App() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20">
      <motion.div 
        className="container max-w-2xl text-center space-y-8 p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            Form Facture
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Gestiona tus facturas y datos de forma inteligente y eficiente
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link to="/menu">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 group relative overflow-hidden"
            >
              <motion.span
                className="relative z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Comenzar
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.div 
            className="p-6 rounded-lg bg-card border border-border/50 hover:border-border transition-colors"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h3 className="font-semibold text-lg mb-2">Gestión Fácil</h3>
            <p className="text-sm text-muted-foreground">
              Crea y edita tablas de datos de forma intuitiva
            </p>
          </motion.div>

          <motion.div 
            className="p-6 rounded-lg bg-card border border-border/50 hover:border-border transition-colors"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h3 className="font-semibold text-lg mb-2">Auto-guardado</h3>
            <p className="text-sm text-muted-foreground">
              Tus cambios se guardan automáticamente
            </p>
          </motion.div>

          <motion.div 
            className="p-6 rounded-lg bg-card border border-border/50 hover:border-border transition-colors"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h3 className="font-semibold text-lg mb-2">Personalizable</h3>
            <p className="text-sm text-muted-foreground">
              Añade columnas y filas según tus necesidades
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}

export default App;

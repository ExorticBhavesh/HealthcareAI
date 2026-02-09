import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Blob 1 */}
      <motion.div
        className="absolute w-[420px] h-[420px] bg-primary/30 rounded-full blur-3xl"
        initial={{ x: -200, y: -200 }}
        animate={{ x: [ -200, 200, -200 ], y: [ -200, 200, -200 ] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Blob 2 */}
      <motion.div
        className="absolute w-[360px] h-[360px] bg-purple-500/30 rounded-full blur-3xl"
        initial={{ x: 300, y: 100 }}
        animate={{ x: [ 300, -300, 300 ], y: [ 100, -200, 100 ] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* Blob 3 */}
      <motion.div
        className="absolute w-[300px] h-[300px] bg-blue-500/30 rounded-full blur-3xl"
        initial={{ x: -100, y: 300 }}
        animate={{ x: [ -100, 250, -100 ], y: [ 300, -150, 300 ] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Flower, Heart, Zap, Users } from 'lucide-react';
import InteractiveBackground from '@/components/InteractiveBackground';
import FlowerTypingEffect from '@/components/FlowerTypingEffect';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-screen">
        {/* Interactive Particle Background */}
        <div className="absolute inset-0">
          <InteractiveBackground />
        </div>

        <div className="relative z-10 text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
          <div className="mb-6 h-96 md:h-[600px] w-full">
            <FlowerTypingEffect
              text="Shapes of Mind"
              className="w-full h-full"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="px-4"
          >
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Living NFT flowers that reflect your mood and the collective consciousness of our community. 
              Each flower evolves based on your emotional state and on-chain interactions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/mint">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center gap-2"
                >
                  <Flower className="w-5 h-5" />
                  Mint Your Flower
                </motion.button>
              </Link>
              <Link href="/gallery">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  View Gallery
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Living Art That Grows With You
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Each flower is a unique living entity that responds to your emotions and the collective mood of our community.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-2xl text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Mood-Driven Evolution</h3>
              <p className="text-gray-300">
                Your flower&apos;s appearance changes based on your mood slider, creating a visual representation of your emotional journey.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-2xl text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Gas-Back Rewards</h3>
              <p className="text-gray-300">
                Get rewarded for interacting with your flower. Our treasury automatically refunds gas fees for mood updates and naming.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-2xl text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Flower className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Collective Consciousness</h3>
              <p className="text-gray-300">
                Your flower&apos;s core reflects the average mood of all holders, creating a living representation of community sentiment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              How It Works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Mint Your Flower",
                description: "Connect your wallet and mint a unique flower with randomized traits and rarity."
              },
              {
                step: "02",
                title: "Set Your Mood",
                description: "Use the mood slider to update your flower&apos;s appearance and track your emotional journey."
              },
              {
                step: "03",
                title: "Watch It Grow",
                description: "Your flower evolves visually based on your mood and the collective community sentiment."
              },
              {
                step: "04",
                title: "Earn Rewards",
                description: "Get gas-back rewards for interactions and watch your flower&apos;s history grow over time."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Ready to Grow Your Flower?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the Shapes of Mind community and start your emotional journey with a living NFT flower.
            </p>
            <Link href="/mint">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-6 rounded-full text-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                <Flower className="w-6 h-6" />
                Start Growing Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer with Attribution */}
      <footer className="relative bg-black/50 border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2025 Shapes of Mind. Built for Shape L2 Hackathon.
            </div>
            <div className="text-gray-500 text-xs relative group">
              <span className="text-purple-400 hover:text-purple-300 transition-colors cursor-pointer">
                Credits
              </span>
              {/* Credits Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                               <div className="mb-1 font-semibold text-purple-400">Credits:</div>
               <div>Flower drawing system: <a href="https://codepen.io/sol187/pen/zYJgyQB" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">@sol187</a></div>
               <div>3D Graphics: <a href="https://threejs.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Three.js</a></div>
               <div>Icons: <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Lucide</a></div>
               <div>Framework: <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Next.js</a></div>
               <div>Animations: <a href="https://framer.com/motion" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Framer Motion</a></div>
                {/* Arrow pointing down */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

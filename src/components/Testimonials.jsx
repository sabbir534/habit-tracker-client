import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 90 },
  },
};

const Testimonials = () => {
  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">
            Don't Just Take Our Word For It
          </h2>
          <p className="mt-2 text-lg text-base-content/70">
            See what our successful users have to say.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Testimonial Card 1 */}
          <motion.div
            variants={itemVariants}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <p className="italic">
                "This app completely changed my morning routine. Seeing that
                streak grow is the best motivation!"
              </p>
              <div className="flex items-center mt-4">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img
                      src="https://i.ibb.co.com/tMddNy3t/photo-1652138785922-e5dde36bbf92.jpg"
                      alt="User 1"
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Sarah K.</h4>
                  <span className="text-sm text-base-content/70">
                    Developer
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <p className="italic">
                "I finally managed to build a consistent workout habit. The
                reminders are a lifesaver, and the UI is beautiful."
              </p>
              <div className="flex items-center mt-4">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img
                      src="https://i.ibb.co.com/yn0JnmpC/images21.jpg"
                      alt="User 2"
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">David L.</h4>
                  <span className="text-sm text-base-content/70">Student</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial Card 3 */}
          <motion.div
            variants={itemVariants}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <p className="italic">
                "As a busy professional, this app helps me track my work and
                personal goals. The 'Public Habits' give me new ideas!"
              </p>
              <div className="flex items-center mt-4">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img
                      src="https://i.ibb.co.com/jkYHX0BS/premium-photo-1689530775582-83b8abdb5020.jpg"
                      alt="User 3"
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Mei Chen</h4>
                  <span className="text-sm text-base-content/70">Manager</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;

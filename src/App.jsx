import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { ToastProvider } from './components/ToastContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import WhatsAppButton from './components/WhatsAppButton'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  }, [])

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route
            path="/admin-login"
            element={<AdminLogin />}
          />
          <Route
            path="/admin-dashboard/*"
            element={<AdminDashboard />}
          />
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Home />
                </main>
                <Footer />
                <WhatsAppButton />
              </>
            }
          />
          <Route
            path="/products"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Products />
                </main>
                <Footer />
                <WhatsAppButton />
              </>
            }
          />
          <Route
            path="/products/:id"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <ProductDetail />
                </main>
                <Footer />
                <WhatsAppButton />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <About />
                </main>
                <Footer />
                <WhatsAppButton />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Contact />
                </main>
                <Footer />
                <WhatsAppButton />
              </>
            }
          />
          <Route
            path="/blog"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Blog />
                </main>
                <Footer />
                <WhatsAppButton />
              </>
            }
          />
          <Route path="/blog/:slug" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <BlogDetail />
                </main>
                <Footer />
                <WhatsAppButton />
              </>
            }
          />
          {/* Catch-all route - redirect to home page */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </div>
    </ToastProvider>
  )
}

export default App 
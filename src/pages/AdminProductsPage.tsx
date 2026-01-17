import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

type Product = {
  id: string
  name: string
  description: string
  price: number
  published: boolean
  created_at: string
  thumbnail_url: string | null
}

function AdminProductsPage() {
  const navigate = useNavigate()
  const [session, setSession] = useState<Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']>(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const isAuthenticated = useMemo(() => Boolean(session), [session])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setCheckingSession(false)
      if (!data.session) navigate('/admin/login', { replace: true })
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (!newSession) navigate('/admin/login', { replace: true })
    })
    return () => listener?.subscription.unsubscribe()
  }, [navigate])

  useEffect(() => {
    if (!isAuthenticated) return
    void fetchProducts()
  }, [isAuthenticated])

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (fetchError) setError(fetchError.message)
    else setProducts((data || []) as Product[])
    setLoading(false)
  }

  const togglePublish = async (product: Product) => {
    setError(null)
    const { error: updateError } = await supabase
      .from('products')
      .update({ published: !product.published })
      .eq('id', product.id)
    if (updateError) {
      setError(updateError.message)
      return
    }
    setStatus(`Product ${!product.published ? 'published' : 'unpublished'}`)
    await fetchProducts()
  }

  const deleteProduct = async (product: Product) => {
    setError(null)
    const { error: deleteError } = await supabase.from('products').delete().eq('id', product.id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    setStatus('Product deleted')
    await fetchProducts()
  }

  if (checkingSession) {
    return (
      <div className="container-page">
        <section className="glass-panel px-8 py-6 text-sm text-slate-700">Checking session…</section>
      </div>
    )
  }
  if (!isAuthenticated) return null

  return (
    <div className="container-page flex flex-col gap-8">
      <section className="glass-panel px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-ink">Products</h2>
            <p className="text-sm text-slate-600">
              Create, publish, and manage products. All changes persist to Supabase.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate('/admin/products/new')}
              className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-slate-900"
            >
              Add product
            </button>
            <button
              type="button"
              onClick={fetchProducts}
              className="rounded-full border border-ink px-4 py-2 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-white"
            >
              Refresh
            </button>
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-amber-700">{error}</p>}
        {status && <p className="mt-2 text-sm text-emerald-700">{status}</p>}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-sand text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-2 py-2">Thumbnail</th>
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Description</th>
                <th className="px-2 py-2">Price</th>
                <th className="px-2 py-2">Published</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-2 py-3 text-slate-600" colSpan={6}>
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && products.length === 0 && (
                <tr>
                  <td className="px-2 py-3 text-slate-600" colSpan={6}>
                    No products yet.
                  </td>
                </tr>
              )}
              {products.map((product) => (
                <tr key={product.id} className="border-b border-sand/70">
                  <td className="px-2 py-3">
                    {product.thumbnail_url ? (
                      <img
                        src={product.thumbnail_url}
                        alt={`${product.name} thumbnail`}
                        className="h-14 w-14 rounded-lg object-cover ring-1 ring-sand"
                      />
                    ) : (
                      <span className="text-xs text-slate-500">No image</span>
                    )}
                  </td>
                  <td className="px-2 py-3 font-semibold text-ink">{product.name}</td>
                  <td className="px-2 py-3 text-slate-700">{product.description}</td>
                  <td className="px-2 py-3 text-slate-700">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(product.price)}
                  </td>
                  <td className="px-2 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        product.published ? 'bg-emerald-100 text-emerald-800' : 'bg-sand text-slate-700'
                      }`}
                    >
                      {product.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void togglePublish(product)}
                        className="rounded-full border border-ink px-3 py-1 text-xs font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-white"
                      >
                        {product.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteProduct(product)}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 transition hover:-translate-y-0.5 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default AdminProductsPage

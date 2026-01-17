const AdminPage = () => (
  <div className="container-page flex flex-col gap-6">
    <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Admin Portal</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Welcome back</h1>
      <p className="mt-2 text-slate-700">
        Use the navigation to manage products. Remember to keep RLS policies tight and never expose
        service keys on the client.
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-ink">
        <button
          type="button"
          onClick={() => {
            window.location.href = '/admin/products'
          }}
          className="rounded-full bg-ink px-5 py-3 text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-slate-900"
        >
          Manage Products
        </button>
        <button
          type="button"
          onClick={() => {
            window.location.href = '/admin/products/new'
          }}
          className="rounded-full border border-ink px-5 py-3 text-ink transition hover:-translate-y-0.5 hover:bg-white"
        >
          Add Product
        </button>
      </div>
    </section>
  </div>
)

export default AdminPage

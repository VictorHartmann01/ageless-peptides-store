const modules = [
  ['Research & Due Diligence', 'Products can enter by Excel, text or image and move through a documented research and review workflow.'],
  ['Inventory & Orders', 'Track stock, sales, reservations and every inventory movement with an auditable history.'],
  ['News & SEO', 'Turn verified research into multilingual editorial content, SEO pages and refreshable knowledge.'],
  ['Social & Campaigns', 'Generate platform-specific campaign assets from approved news and content with a review gate.'],
  ['AI Operations', 'Use natural-language commands to propose and execute controlled changes across the store.'],
  ['Governance', 'Keep sources, review status, compliance notes and change history connected to the underlying records.'],
];

export default function Home() {
  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">AgeLess Peptides Store <span className="badge">FOUNDATION</span></div>
        <div className="metric-label">Production architecture</div>
      </header>
      <div className="layout">
        <aside className="sidebar">
          <div className="nav-title">Operations</div>
          <a className="nav-item active" href="#overview">Overview</a>
          <a className="nav-item" href="#products">Products</a>
          <a className="nav-item" href="#inventory">Inventory</a>
          <a className="nav-item" href="#research">Due Diligence</a>
          <a className="nav-item" href="#content">News & SEO</a>
          <a className="nav-item" href="#campaigns">Social & Campaigns</a>
          <a className="nav-item" href="#ai">AI Operations</a>
        </aside>
        <main className="main" id="overview">
          <div className="eyebrow">AgeLess command center</div>
          <h1>Store foundation</h1>
          <p className="subtitle">The application layer will sit on top of the existing Supabase commerce database and the connected GitHub repository.</p>

          <section className="grid">
            <div className="card"><div className="metric-label">Product intelligence</div><div className="metric">Ready</div></div>
            <div className="card"><div className="metric-label">Inventory model</div><div className="metric">Planned</div></div>
            <div className="card"><div className="metric-label">Research pipeline</div><div className="metric">Planned</div></div>
            <div className="card"><div className="metric-label">Content engine</div><div className="metric">Planned</div></div>
          </section>

          <section className="section">
            <h2>Core modules</h2>
            <div className="workflow">
              {modules.map(([title, description]) => (
                <div className="card" key={title}>
                  <strong>{title}</strong>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

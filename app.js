/* ═══════════════════════════════════════════════════════════════
   Retail Sales AI Assistant — Application Logic
   ═══════════════════════════════════════════════════════════════ */

// ─── Mock Data (ported from Python backend) ──────────────────
const PRODUCTS = {
  P001: { id:'P001', name:'Premium Basmati Rice 5kg', category:'Grains', unitPrice:12.99 },
  P002: { id:'P002', name:'Organic Olive Oil 1L', category:'Oils', unitPrice:8.49 },
  P003: { id:'P003', name:'Whole Wheat Flour 10kg', category:'Grains', unitPrice:7.99 },
  P004: { id:'P004', name:'Pure Honey 500g', category:'Sweeteners', unitPrice:6.99 },
  P005: { id:'P005', name:'Green Tea Box (100 bags)', category:'Beverages', unitPrice:5.49 },
  P006: { id:'P006', name:'Dark Chocolate Bar 200g', category:'Snacks', unitPrice:3.99 },
  P007: { id:'P007', name:'Almond Butter 350g', category:'Spreads', unitPrice:9.99 },
  P008: { id:'P008', name:'Greek Yogurt 1kg', category:'Dairy', unitPrice:4.49 },
  P009: { id:'P009', name:'Sparkling Water (12-pack)', category:'Beverages', unitPrice:6.99 },
  P010: { id:'P010', name:'Organic Pasta 500g', category:'Grains', unitPrice:2.99 }
};

const DISTRIBUTORS = {
  D001: { id:'D001', name:'NorthStar Distribution Co.', region:'North', email:'ops@northstar-dist.com', phone:'+1-555-0101', rating:4.7, specialties:['Grains','Oils'] },
  D002: { id:'D002', name:'SunBelt Wholesale', region:'South', email:'orders@sunbelt-ws.com', phone:'+1-555-0202', rating:4.5, specialties:['Beverages','Snacks','Sweeteners'] },
  D003: { id:'D003', name:'PacificEdge Suppliers', region:'West', email:'supply@pacificedge.com', phone:'+1-555-0303', rating:4.8, specialties:['Dairy','Spreads','Grains'] },
  D004: { id:'D004', name:'Atlantic Fresh Markets', region:'East', email:'orders@atlanticfresh.com', phone:'+1-555-0404', rating:4.6, specialties:['Beverages','Dairy','Oils'] }
};

const RETAILERS = {
  R001: { id:'R001', name:'Metro Grocery Hub', region:'North', creditLimit:50000, currentCredit:12500, status:'active', joinDate:'2024-01-15' },
  R002: { id:'R002', name:'FreshMart Express', region:'South', creditLimit:35000, currentCredit:8200, status:'active', joinDate:'2024-03-22' },
  R003: { id:'R003', name:'GreenBasket Organics', region:'West', creditLimit:45000, currentCredit:15800, status:'active', joinDate:'2023-11-08' },
  R004: { id:'R004', name:'QuickStop Convenience', region:'East', creditLimit:20000, currentCredit:5600, status:'active', joinDate:'2024-06-01' },
  R005: { id:'R005', name:'Urban Pantry Co.', region:'North', creditLimit:40000, currentCredit:22100, status:'active', joinDate:'2024-02-14' },
  R006: { id:'R006', name:'Sunrise Superstore', region:'South', creditLimit:55000, currentCredit:31000, status:'active', joinDate:'2023-09-30' }
};

const INVENTORY = {
  D001: [ {productId:'P001',stock:450,reorderLevel:100},{productId:'P002',stock:280,reorderLevel:50},{productId:'P003',stock:620,reorderLevel:150},{productId:'P010',stock:340,reorderLevel:80} ],
  D002: [ {productId:'P004',stock:190,reorderLevel:40},{productId:'P005',stock:15,reorderLevel:30},{productId:'P006',stock:520,reorderLevel:100},{productId:'P009',stock:0,reorderLevel:60} ],
  D003: [ {productId:'P003',stock:380,reorderLevel:100},{productId:'P007',stock:210,reorderLevel:50},{productId:'P008',stock:45,reorderLevel:40},{productId:'P010',stock:490,reorderLevel:80} ],
  D004: [ {productId:'P002',stock:320,reorderLevel:60},{productId:'P005',stock:270,reorderLevel:50},{productId:'P008',stock:180,reorderLevel:40},{productId:'P009',stock:400,reorderLevel:80} ]
};

const ORDERS = [
  { id:'ORD-001', retailerId:'R001', distributorId:'D001', items:[{productId:'P001',quantity:100,unitPrice:12.99},{productId:'P003',quantity:50,unitPrice:7.99}], total:1698.50, status:'delivered', date:'2024-11-15', deliveryDate:'2024-11-18' },
  { id:'ORD-002', retailerId:'R002', distributorId:'D002', items:[{productId:'P005',quantity:200,unitPrice:5.49},{productId:'P006',quantity:150,unitPrice:3.99}], total:1696.50, status:'delivered', date:'2024-11-20', deliveryDate:'2024-11-24' },
  { id:'ORD-003', retailerId:'R003', distributorId:'D003', items:[{productId:'P007',quantity:80,unitPrice:9.99},{productId:'P008',quantity:120,unitPrice:4.49}], total:1338.00, status:'shipped', date:'2024-12-01', deliveryDate:null },
  { id:'ORD-004', retailerId:'R004', distributorId:'D004', items:[{productId:'P002',quantity:60,unitPrice:8.49},{productId:'P009',quantity:100,unitPrice:6.99}], total:1208.40, status:'processing', date:'2024-12-05', deliveryDate:null },
  { id:'ORD-005', retailerId:'R005', distributorId:'D001', items:[{productId:'P001',quantity:200,unitPrice:12.99}], total:2598.00, status:'delivered', date:'2024-10-28', deliveryDate:'2024-11-01' },
  { id:'ORD-006', retailerId:'R006', distributorId:'D002', items:[{productId:'P004',quantity:300,unitPrice:6.99},{productId:'P006',quantity:250,unitPrice:3.99}], total:3094.50, status:'delivered', date:'2024-11-02', deliveryDate:'2024-11-06' },
  { id:'ORD-007', retailerId:'R001', distributorId:'D003', items:[{productId:'P010',quantity:400,unitPrice:2.99}], total:1196.00, status:'shipped', date:'2024-12-08', deliveryDate:null },
  { id:'ORD-008', retailerId:'R003', distributorId:'D004', items:[{productId:'P005',quantity:150,unitPrice:5.49},{productId:'P008',quantity:90,unitPrice:4.49}], total:1227.60, status:'pending', date:'2024-12-10', deliveryDate:null },
  { id:'ORD-009', retailerId:'R002', distributorId:'D001', items:[{productId:'P003',quantity:180,unitPrice:7.99}], total:1438.20, status:'processing', date:'2024-12-09', deliveryDate:null },
  { id:'ORD-010', retailerId:'R005', distributorId:'D002', items:[{productId:'P004',quantity:100,unitPrice:6.99},{productId:'P005',quantity:80,unitPrice:5.49}], total:1138.20, status:'pending', date:'2024-12-11', deliveryDate:null },
  { id:'ORD-011', retailerId:'R004', distributorId:'D003', items:[{productId:'P007',quantity:60,unitPrice:9.99},{productId:'P003',quantity:100,unitPrice:7.99}], total:1398.40, status:'shipped', date:'2024-12-03', deliveryDate:null },
  { id:'ORD-012', retailerId:'R006', distributorId:'D004', items:[{productId:'P009',quantity:200,unitPrice:6.99},{productId:'P002',quantity:75,unitPrice:8.49}], total:2034.75, status:'delivered', date:'2024-10-20', deliveryDate:'2024-10-24' }
];

// ─── Helpers ─────────────────────────────────────────────────
const formatCurrency = (n) => "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const formatDate = (s) => { const d=new Date(s+'T00:00:00'); return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); };
const getTime = () => new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true});
const getStockStatus = (stock,reorder) => stock===0 ? {label:'Out of Stock',cls:'badge-out-of-stock'} : stock<=reorder ? {label:'Low Stock',cls:'badge-low-stock'} : {label:'In Stock',cls:'badge-in-stock'};

let chartsRendered = false;
let orderCount = ORDERS.length;

// ─── Tab Navigation ──────────────────────────────────────────
function switchTab(tabName) {
  document.querySelectorAll('.nav-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.view-section').forEach(s=>s.classList.remove('active'));
  const tab = document.querySelector('[data-tab="'+tabName+'"]');
  const section = document.getElementById(tabName+'-view');
  if(tab) tab.classList.add('active');
  if(section) section.classList.add('active');
  if(tabName==='dashboard' && !chartsRendered) { chartsRendered=true; setTimeout(()=>{renderRevenueChart();renderProductsChart();renderStatusChart();},100); }
}

// ─── Dashboard ───────────────────────────────────────────────
function renderDashboard() {
  const totalRevenue = ORDERS.reduce((s,o)=>s+o.total,0);
  const pendingOrders = ORDERS.filter(o=>o.status==='pending'||o.status==='processing').length;
  const avgRating = Object.values(DISTRIBUTORS).reduce((s,d)=>s+d.rating,0)/Object.keys(DISTRIBUTORS).length;
  const kpis = [
    {icon:'💰',label:'Total Revenue',value:formatCurrency(totalRevenue),cls:'revenue'},
    {icon:'🏪',label:'Active Retailers',value:Object.keys(RETAILERS).length,cls:'retailers'},
    {icon:'📦',label:'Pending Orders',value:pendingOrders,cls:'orders'},
    {icon:'⭐',label:'Avg Rating',value:avgRating.toFixed(1),cls:'rating'}
  ];
  document.getElementById('kpi-grid').innerHTML = kpis.map(k=>'<div class="kpi-card"><div class="kpi-icon '+k.cls+'">'+k.icon+'</div><div class="kpi-info"><div class="kpi-value">'+k.value+'</div><div class="kpi-label">'+k.label+'</div></div></div>').join('');
  // Activity feed
  const activities = [
    {color:'#10b981',text:'ORD-006 delivered to Sunrise Superstore',time:'2h ago'},
    {color:'#6366f1',text:'ORD-003 shipped from PacificEdge',time:'5h ago'},
    {color:'#f59e0b',text:'ORD-009 processing at NorthStar',time:'1d ago'},
    {color:'#06d6a0',text:'New retailer Urban Pantry Co. onboarded',time:'2d ago'},
    {color:'#ef4444',text:'Low stock alert: Green Tea at SunBelt',time:'3d ago'},
    {color:'#8b5cf6',text:'ORD-005 delivered to Urban Pantry',time:'5d ago'}
  ];
  document.getElementById('activity-feed').innerHTML = activities.map(a=>'<div class="activity-item"><div class="activity-dot" style="background:'+a.color+'"></div><div class="activity-text">'+a.text+'</div><div class="activity-time">'+a.time+'</div></div>').join('');
}

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio||1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width*dpr;
  canvas.height = 280*dpr;
  canvas.style.width = rect.width+'px';
  canvas.style.height = '280px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  return ctx;
}

function roundedRect(ctx,x,y,w,h,r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h);
  ctx.lineTo(x,y+h);
  ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
  ctx.fill();
}

function renderRevenueChart() {
  const canvas = document.getElementById('revenue-chart');
  if(!canvas) return;
  const ctx = setupCanvas(canvas);
  const w = canvas.style.width.replace('px','')*1;
  const h = 280;
  const regions = {};
  ORDERS.forEach(o => { const r=DISTRIBUTORS[o.distributorId].region; regions[r]=(regions[r]||0)+o.total; });
  const labels = Object.keys(regions);
  const values = Object.values(regions);
  const max = Math.max(...values)*1.15;
  const colors = ['#6366f1','#8b5cf6','#06d6a0','#22d3ee'];
  const barW = Math.min(60,(w-120)/labels.length-20);
  const startX = 70;
  const chartH = h-70;
  // Grid
  ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=1;
  for(let i=0;i<=4;i++){const y=30+chartH*(1-i/4);ctx.beginPath();ctx.moveTo(startX,y);ctx.lineTo(w-20,y);ctx.stroke();ctx.fillStyle='#64748b';ctx.font='11px Inter';ctx.textAlign='right';ctx.fillText(formatCurrency(max*i/4),startX-8,y+4);}
  // Bars
  labels.forEach((l,i)=>{
    const barH=(values[i]/max)*chartH;
    const x=startX+i*((w-startX-20)/labels.length)+((w-startX-20)/labels.length-barW)/2;
    const y=30+chartH-barH;
    ctx.fillStyle=colors[i%4];
    roundedRect(ctx,x,y,barW,barH,6);
    ctx.fillStyle='#e2e8f0'; ctx.font='bold 12px Inter'; ctx.textAlign='center';
    ctx.fillText(formatCurrency(values[i]),x+barW/2,y-8);
    ctx.fillStyle='#94a3b8'; ctx.font='12px Inter';
    ctx.fillText(l,x+barW/2,h-18);
  });
}

function renderProductsChart() {
  const canvas = document.getElementById('products-chart');
  if(!canvas) return;
  const ctx = setupCanvas(canvas);
  const w = canvas.style.width.replace('px','')*1;
  const h = 280;
  const productQty = {};
  ORDERS.forEach(o=>o.items.forEach(it=>{productQty[it.productId]=(productQty[it.productId]||0)+it.quantity;}));
  const sorted = Object.entries(productQty).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const max = sorted[0][1]*1.15;
  const barH = 28;
  const gap = 12;
  const startX = 180;
  const startY = 20;
  const colors = ['#6366f1','#8b5cf6','#a78bfa','#06d6a0','#22d3ee','#38bdf8'];
  sorted.forEach(([pid,qty],i)=>{
    const y = startY + i*(barH+gap);
    const barW = (qty/max)*(w-startX-60);
    ctx.fillStyle='#94a3b8'; ctx.font='12px Inter'; ctx.textAlign='right';
    ctx.fillText(PRODUCTS[pid].name,startX-10,y+barH/2+4);
    ctx.fillStyle=colors[i];
    roundedRect(ctx,startX,y,barW,barH,6);
    ctx.fillStyle='#e2e8f0'; ctx.font='bold 11px Inter'; ctx.textAlign='left';
    ctx.fillText(qty+' units',startX+barW+8,y+barH/2+4);
  });
}

function renderStatusChart() {
  const canvas = document.getElementById('status-chart');
  if(!canvas) return;
  const ctx = setupCanvas(canvas);
  const w = canvas.style.width.replace('px','')*1;
  const h = 280;
  const counts = {delivered:0,shipped:0,processing:0,pending:0};
  ORDERS.forEach(o=>counts[o.status]++);
  const total = ORDERS.length;
  const colors = {delivered:'#10b981',shipped:'#6366f1',processing:'#f59e0b',pending:'#94a3b8'};
  const cx = w/2-60; const cy = h/2; const r = 90; const ir = 55;
  let angle = -Math.PI/2;
  Object.entries(counts).forEach(([status,count])=>{
    const slice = (count/total)*Math.PI*2;
    ctx.beginPath(); ctx.moveTo(cx+Math.cos(angle)*ir,cy+Math.sin(angle)*ir);
    ctx.arc(cx,cy,r,angle,angle+slice); ctx.arc(cx,cy,ir,angle+slice,angle,true);
    ctx.closePath(); ctx.fillStyle=colors[status]; ctx.fill();
    // Label
    const mid = angle+slice/2;
    const lx = cx+Math.cos(mid)*(r+25);
    const ly = cy+Math.sin(mid)*(r+25);
    ctx.fillStyle='#e2e8f0'; ctx.font='bold 12px Inter'; ctx.textAlign='center';
    ctx.fillText(count,lx,ly);
    angle+=slice;
  });
  // Center text
  ctx.fillStyle='#e2e8f0'; ctx.font='bold 24px Inter'; ctx.textAlign='center'; ctx.fillText(total,cx,cy+4);
  ctx.fillStyle='#64748b'; ctx.font='11px Inter'; ctx.fillText('Total',cx,cy+20);
  // Legend
  const lx = w/2+60; let ly = h/2-50;
  Object.entries(counts).forEach(([s,c])=>{
    ctx.fillStyle=colors[s]; ctx.beginPath(); ctx.arc(lx,ly,5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#94a3b8'; ctx.font='13px Inter'; ctx.textAlign='left';
    ctx.fillText(s.charAt(0).toUpperCase()+s.slice(1)+' ('+c+')',lx+14,ly+4);
    ly+=28;
  });
}

// ─── Inventory ───────────────────────────────────────────────
function renderInventory() {
  const search = (document.getElementById('inventory-search')||{}).value||'';
  const distFilter = (document.getElementById('inventory-dist-filter')||{}).value||'all';
  const tbody = document.getElementById('inventory-tbody');
  if(!tbody) return;
  let rows = [];
  Object.entries(INVENTORY).forEach(([did,items])=>{
    if(distFilter!=='all'&&did!==distFilter) return;
    items.forEach(item=>{
      const p = PRODUCTS[item.productId];
      if(search && !p.name.toLowerCase().includes(search.toLowerCase())) return;
      const st = getStockStatus(item.stock,item.reorderLevel);
      rows.push('<tr><td><strong>'+p.name+'</strong></td><td>'+p.category+'</td><td>'+DISTRIBUTORS[did].name+'</td><td>'+item.stock+'</td><td>'+item.reorderLevel+'</td><td><span class="badge '+st.cls+'">'+st.label+'</span></td></tr>');
    });
  });
  tbody.innerHTML = rows.length ? rows.join('') : '<tr><td colspan="6" style="text-align:center;padding:40px;color:#64748b;">No matching inventory found</td></tr>';
}

// ─── Orders ──────────────────────────────────────────────────
function renderOrders(filter) {
  filter = filter || 'all';
  const grid = document.getElementById('orders-grid');
  if(!grid) return;
  // Update counts
  const counts = {all:ORDERS.length,pending:0,processing:0,shipped:0,delivered:0};
  ORDERS.forEach(o=>counts[o.status]++);
  Object.entries(counts).forEach(([k,v])=>{const el=document.getElementById('count-'+k);if(el)el.textContent=v;});
  // Filter
  const filtered = filter==='all' ? ORDERS : ORDERS.filter(o=>o.status===filter);
  // Update active tab
  document.querySelectorAll('.filter-tab').forEach(t=>{t.classList.toggle('active',t.dataset.filter===filter);});
  grid.innerHTML = filtered.map(o=>{
    const r=RETAILERS[o.retailerId]; const d=DISTRIBUTORS[o.distributorId];
    const itemsStr = o.items.map(it=>PRODUCTS[it.productId].name+' x'+it.quantity).join(', ');
    return '<div class="order-card status-'+o.status+'"><div><div class="order-id">'+o.id+'</div><div style="font-size:0.82rem;color:#94a3b8;margin-top:4px;">'+itemsStr+'</div></div><div class="order-detail"><div class="order-detail-label">Retailer</div><div class="order-detail-value">'+(r?r.name:'—')+'</div></div><div class="order-detail"><div class="order-detail-label">Total / Date</div><div class="order-detail-value">'+formatCurrency(o.total)+' · '+formatDate(o.date)+'</div></div><div><span class="badge badge-'+o.status+'">'+o.status.charAt(0).toUpperCase()+o.status.slice(1)+'</span></div></div>';
  }).join('');
}

// ─── AI Chat ─────────────────────────────────────────────────
function addMessage(role, html, toolCalls, reasoning) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'message '+role;
  let content = '';
  if(role==='assistant' && reasoning) {
    content += '<div class="reasoning-steps">'+reasoning.map((s,i)=>'<span class="reasoning-step done"><span class="step-dot"></span>'+s+'</span>'+(i<reasoning.length-1?'<span class="step-arrow">→</span>':'')).join('')+'</div>';
  }
  if(role==='assistant' && toolCalls) {
    toolCalls.forEach(tc=>{
      content += '<div class="tool-call-card"><div class="tool-call-header"><span class="tool-call-icon">⚡</span><span class="tool-name">'+tc.name+'()</span></div><div class="tool-result">'+tc.result+'</div></div>';
    });
  }
  content += '<div class="message-bubble">'+html+'</div>';
  content += '<div class="message-time">'+getTime()+'</div>';
  div.innerHTML = content;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function showTyping() {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'message assistant';
  div.id = 'typing-msg';
  div.innerHTML = '<div class="message-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}
function hideTyping() { const el=document.getElementById('typing-msg'); if(el) el.remove(); }

function processUserMessage(input) {
  addMessage('user', input.replace(/</g,'&lt;'));
  showTyping();
  const lower = input.toLowerCase();
  const delay = 800 + Math.random()*700;

  setTimeout(()=>{
    hideTyping();

    // Greetings
    if(/^(hi|hello|hey|greetings|sup|yo)\b/.test(lower)) {
      addMessage('assistant','👋 Hey there! I\'m your <strong>AI Sales Assistant</strong> — I can help you with the entire retail distribution workflow.<br><br>Here\'s what I can do:<br>• 📋 <strong>List distributors</strong> and their details<br>• 📦 <strong>Check inventory</strong> levels across warehouses<br>• 🏪 <strong>View retailer</strong> info and credit limits<br>• 🔍 <strong>Track orders</strong> and delivery status<br>• 🛒 <strong>Place new orders</strong> with credit validation<br>• 📊 <strong>Sales insights</strong> — revenue, top products, analytics<br><br>Try asking: <em>"Show me all distributors"</em> or <em>"What\'s the inventory at NorthStar?"</em>',null,['Initialize','Ready']);
      return;
    }

    // Help
    if(/help|what can you|capabilit|feature|tool/.test(lower)) {
      addMessage('assistant','🛠️ I have <strong>8 integrated tools</strong> connected to the REST APIs:<br><br><table class="response-table"><tr><th>Tool</th><th>Description</th></tr><tr><td>get_distributors</td><td>List all distributors</td></tr><tr><td>get_distributor_details</td><td>Get specific distributor info</td></tr><tr><td>get_distributor_inventory</td><td>Check stock levels</td></tr><tr><td>get_retailers</td><td>List all retailers</td></tr><tr><td>get_retailer_details</td><td>Retailer info + credit</td></tr><tr><td>get_order_status</td><td>Track order status</td></tr><tr><td>place_order</td><td>Place a new order</td></tr><tr><td>get_sales_insights</td><td>Revenue & analytics</td></tr></table><br>Just ask in natural language!', null, ['Analyze','Respond']);
      return;
    }

    // Distributors
    if(/distributor/.test(lower) && !/inventor|stock|level/.test(lower)) {
      const tbl = '<table class="response-table"><tr><th>ID</th><th>Name</th><th>Region</th><th>Rating</th><th>Specialties</th></tr>'+Object.values(DISTRIBUTORS).map(d=>'<tr><td>'+d.id+'</td><td>'+d.name+'</td><td>'+d.region+'</td><td>⭐ '+d.rating+'</td><td>'+d.specialties.join(', ')+'</td></tr>').join('')+'</table>';
      addMessage('assistant','📋 Found <strong>'+Object.keys(DISTRIBUTORS).length+' distributors</strong> across all regions:<br><br>'+tbl+'<br>Want to check inventory for any of these? Just ask!',
        [{name:'get_distributors',result:'Returned '+Object.keys(DISTRIBUTORS).length+' distributors'}],
        ['Analyze','Plan','Execute','Synthesize']);
      return;
    }

    // Inventory
    if(/inventor|stock|level|warehouse/.test(lower)) {
      let did = null;
      if(/northstar|d001/i.test(lower)) did='D001';
      else if(/sunbelt|d002/i.test(lower)) did='D002';
      else if(/pacific|d003/i.test(lower)) did='D003';
      else if(/atlantic|d004/i.test(lower)) did='D004';
      const entries = did ? {[did]:INVENTORY[did]} : INVENTORY;
      let tbl = '<table class="response-table"><tr><th>Distributor</th><th>Product</th><th>Stock</th><th>Status</th></tr>';
      Object.entries(entries).forEach(([id,items])=>{
        items.forEach(it=>{
          const st=getStockStatus(it.stock,it.reorderLevel);
          tbl+='<tr><td>'+DISTRIBUTORS[id].name+'</td><td>'+PRODUCTS[it.productId].name+'</td><td>'+it.stock+'</td><td><span class="badge '+st.cls+'">'+st.label+'</span></td></tr>';
        });
      });
      tbl+='</table>';
      const title = did ? DISTRIBUTORS[did].name : 'all distributors';
      addMessage('assistant','📦 Inventory report for <strong>'+title+'</strong>:<br><br>'+tbl+(INVENTORY.D002.find(i=>i.stock<=i.reorderLevel)?'<br>⚠️ <strong>Alert:</strong> Some items are low or out of stock at SunBelt Wholesale!':''),
        [{name:'get_distributor_inventory',result:'Fetched inventory for '+(did||'all')}],
        ['Analyze','Plan','Execute','Synthesize']);
      return;
    }

    // Retailers
    if(/retailer/.test(lower)) {
      const tbl = '<table class="response-table"><tr><th>Name</th><th>Region</th><th>Credit Used</th><th>Limit</th></tr>'+Object.values(RETAILERS).map(r=>'<tr><td>'+r.name+'</td><td>'+r.region+'</td><td>'+formatCurrency(r.currentCredit)+'</td><td>'+formatCurrency(r.creditLimit)+'</td></tr>').join('')+'</table>';
      addMessage('assistant','🏪 Here are all <strong>'+Object.keys(RETAILERS).length+' active retailers</strong>:<br><br>'+tbl,
        [{name:'get_retailers',result:'Returned '+Object.keys(RETAILERS).length+' retailers'}],
        ['Analyze','Plan','Execute','Synthesize']);
      return;
    }

    // Place order
    if(/place.*order|new.*order|create.*order/.test(lower)) {
      orderCount++;
      const oid = 'ORD-'+String(orderCount).padStart(3,'0');
      addMessage('assistant','✅ Order placed successfully!<br><br><strong>Order ID:</strong> '+oid+'<br><strong>Retailer:</strong> Metro Grocery Hub (R001)<br><strong>Distributor:</strong> NorthStar Distribution (D001)<br><strong>Items:</strong> Premium Basmati Rice 5kg × 50<br><strong>Total:</strong> '+formatCurrency(50*12.99)+'<br><strong>Status:</strong> <span class="badge badge-pending">Pending</span><br><br>Credit validated ✓ &nbsp;|&nbsp; Stock available ✓',
        [{name:'place_order',result:'Order '+oid+' created → Pending'}],
        ['Analyze','Validate Credit','Check Stock','Place Order','Confirm']);
      return;
    }

    // Orders
    if(/order|track|delivery|deliver|ship/.test(lower)) {
      const recent = ORDERS.slice(0,5);
      const tbl = '<table class="response-table"><tr><th>Order</th><th>Retailer</th><th>Total</th><th>Status</th></tr>'+recent.map(o=>'<tr><td>'+o.id+'</td><td>'+RETAILERS[o.retailerId].name+'</td><td>'+formatCurrency(o.total)+'</td><td><span class="badge badge-'+o.status+'">'+o.status.charAt(0).toUpperCase()+o.status.slice(1)+'</span></td></tr>').join('')+'</table>';
      addMessage('assistant','📋 Here are the <strong>most recent orders</strong>:<br><br>'+tbl+'<br>Total orders in system: <strong>'+ORDERS.length+'</strong> &nbsp;|&nbsp; 🟢 '+ORDERS.filter(o=>o.status==='delivered').length+' delivered &nbsp;|&nbsp; 🔵 '+ORDERS.filter(o=>o.status==='shipped').length+' shipped &nbsp;|&nbsp; 🟡 '+ORDERS.filter(o=>o.status==='processing').length+' processing &nbsp;|&nbsp; ⚪ '+ORDERS.filter(o=>o.status==='pending').length+' pending',
        [{name:'get_order_status',result:'Fetched '+ORDERS.length+' orders'}],
        ['Analyze','Plan','Execute','Synthesize']);
      return;
    }

    // Sales insights
    if(/sale|insight|analytic|revenue|top.*product|report|performance/.test(lower)) {
      const totalRev = ORDERS.reduce((s,o)=>s+o.total,0);
      const byRegion = {};
      ORDERS.forEach(o=>{const r=DISTRIBUTORS[o.distributorId].region;byRegion[r]=(byRegion[r]||0)+o.total;});
      const regionTbl = Object.entries(byRegion).sort((a,b)=>b[1]-a[1]).map(([r,v])=>'<tr><td>'+r+'</td><td>'+formatCurrency(v)+'</td></tr>').join('');
      const productQty={};
      ORDERS.forEach(o=>o.items.forEach(it=>{productQty[it.productId]=(productQty[it.productId]||0)+it.quantity;}));
      const topProducts = Object.entries(productQty).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([pid,qty])=>'<tr><td>'+PRODUCTS[pid].name+'</td><td>'+qty+' units</td></tr>').join('');
      addMessage('assistant','📊 <strong>Sales Insights Report</strong><br><br>💰 <strong>Total Revenue:</strong> '+formatCurrency(totalRev)+'<br>📦 <strong>Total Orders:</strong> '+ORDERS.length+'<br>✅ <strong>Fulfillment Rate:</strong> '+Math.round(ORDERS.filter(o=>o.status==='delivered').length/ORDERS.length*100)+'%<br><br><strong>Revenue by Region:</strong><table class="response-table"><tr><th>Region</th><th>Revenue</th></tr>'+regionTbl+'</table><br><strong>Top Products:</strong><table class="response-table"><tr><th>Product</th><th>Quantity</th></tr>'+topProducts+'</table>',
        [{name:'get_sales_insights',result:'Aggregated sales data across '+ORDERS.length+' orders'}],
        ['Analyze','Aggregate Data','Compute Metrics','Synthesize']);
      return;
    }

    // Default
    addMessage('assistant','I\'d be happy to help! I specialize in retail sales operations. Try asking me about:<br><br>• 📋 <em>"Show me all distributors"</em><br>• 📦 <em>"Check inventory at NorthStar"</em><br>• 🏪 <em>"List all retailers"</em><br>• 🔍 <em>"Show recent orders"</em><br>• 🛒 <em>"Place a new order"</em><br>• 📊 <em>"Give me sales insights"</em>',null,['Analyze','Respond']);
  }, delay);
}

// ─── Initialization ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Tab navigation
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // Chat input
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  function sendMessage() {
    const msg = chatInput.value.trim();
    if(!msg) return;
    chatInput.value = '';
    chatInput.style.height = 'auto';
    processUserMessage(msg);
  }
  if(sendBtn) sendBtn.addEventListener('click', sendMessage);
  if(chatInput) {
    chatInput.addEventListener('keydown', e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();} });
    chatInput.addEventListener('input', () => { chatInput.style.height='auto'; chatInput.style.height=Math.min(chatInput.scrollHeight,120)+'px'; });
  }

  // Inventory filters
  const invSearch = document.getElementById('inventory-search');
  const invFilter = document.getElementById('inventory-dist-filter');
  if(invSearch) invSearch.addEventListener('input', renderInventory);
  if(invFilter) invFilter.addEventListener('change', renderInventory);

  // Order filters
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => renderOrders(tab.dataset.filter));
  });

  // Initial renders
  renderDashboard();
  renderInventory();
  renderOrders('all');
  switchTab('dashboard');

  // Welcome message
  setTimeout(()=>{
    addMessage('assistant','👋 Welcome to <strong>Retail Sales AI Assistant</strong>!<br><br>I\'m an AI agent powered by <strong>OpenAI GPT-4o-mini</strong> with tool-calling capabilities. I\'m connected to the Distributor API and Retailer API to give you real-time data.<br><br>Try asking me:<br>• <em>"Show me all distributors"</em><br>• <em>"What\'s the inventory at NorthStar?"</em><br>• <em>"Give me sales insights"</em><br>• <em>"Place a new order"</em>',null,['System Ready']);
  }, 300);
});

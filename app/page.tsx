import Link from 'next/link';

const pillars = [
  ['MDX', 'Kết hợp giải thích Markdown với React component có thể tái sử dụng.'],
  ['Live code', 'Chỉnh sửa ví dụ React và xem preview cô lập ngay trong trình duyệt.'],
  ['AI assistant', 'Gửi câu hỏi về code qua API server-side được giới hạn đầu vào.'],
  ['Semantic search', 'Truy vấn ngữ nghĩa qua pgvector thay cho chỉ khớp từ khóa.'],
];

export default function HomePage() {
  return <main className="landing"><p className="eyebrow">VELCLAW / TECHDOCS</p><h1>Tài liệu kỹ thuật để đọc, thử và hiểu.</h1><p className="lede">Một nền tảng Next.js App Router cho MDX tương tác, live playground, trợ lý AI và tìm kiếm semantic.</p><Link className="button" href="/docs/intro">Mở tài liệu →</Link><section className="pillar-grid">{pillars.map(([title, description]) => <article key={title}><h2>{title}</h2><p>{description}</p></article>)}</section></main>;
}

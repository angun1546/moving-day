import { useEffect, useMemo, useState } from 'react'
import { getQuotes } from '../services/quotes'
import { usePagination } from '../hooks/usePagination'
import Pagination from '../components/Pagination'
import AddonChips from '../components/AddonChips'
import { useConfirm } from '../context/ConfirmContext'
import { maskKoreanNamesInText } from '../utils/userDisplay'
import { addNotification } from '../utils/notifications'
import { formatDate } from '../utils/date'
import { getReviews, updateReview } from '../services/reviews'
import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from '../services/notices'
import { getQna, updateQna } from '../services/qna'
import { getStories, updateStory } from '../services/stories'
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../services/projects'
import {
  getVlogs,
  createVlog,
  updateVlog,
  deleteVlog,
} from '../services/vlogs'

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20'

const won = (n) => n.toLocaleString('ko-KR')

// 관리자 대시보드 카테고리 (왼쪽 사이드바)
const SECTIONS = [
  { key: 'match', label: '매칭·입찰' },
  { key: 'reviews', label: '리뷰 관리' },
  { key: 'qa', label: 'Q&A 답변' },
  { key: 'notice', label: '공지사항' },
  { key: 'projects', label: '무빙 프로젝트' },
]

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="font-inter text-3xl font-bold text-brand">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  )
}

function Empty() {
  return (
    <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
      <p className="text-3xl">📭</p>
      <p className="mt-3 font-semibold text-gray-700">데이터가 없습니다</p>
    </div>
  )
}

// 리뷰 카드 — 통합 객체(_kind, type, author, ...) 받아 처리
function ReviewItem({ review, onToggleHide, onReply, onClearReply }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [editing, setEditing] = useState(false)
  const [editDraft, setEditDraft] = useState('')

  function save() {
    if (!draft.trim()) return
    onReply(review, draft.trim())
    setDraft('')
    setOpen(false)
  }
  function startEdit() {
    setEditDraft(review.reply || '')
    setEditing(true)
  }
  function saveEdit() {
    if (!editDraft.trim()) return
    onReply(review, editDraft.trim())
    setEditing(false)
  }

  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm ${
        review.hidden ? 'border-gray-200 opacity-60' : 'border-gray-100'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
              {review.type}
            </span>
            <span className="text-amber-400">
              {'★'.repeat(review.rating)}
              <span className="text-gray-200">
                {'★'.repeat(5 - review.rating)}
              </span>
            </span>
            {review.hidden && (
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-600">
                숨김
              </span>
            )}
          </div>
          <p className="mt-2 leading-relaxed text-gray-700">{review.text}</p>
          <p className="mt-2 text-xs text-gray-400">
            {review.author} · {review.displayDate || ''}
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => onToggleHide(review)}
            className="rounded-full border border-gray-300 px-3 py-1.5 font-semibold text-gray-600 transition hover:border-brand hover:text-brand"
          >
            {review.hidden ? '노출' : '숨김'}
          </button>
        </div>
      </div>

      {/* 관리자 답변 */}
      {review.reply && !editing ? (
        <div className="mt-4 rounded-xl bg-brand-bg p-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white">
              관리자 답변
            </span>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={startEdit}
                className="font-semibold text-gray-600 hover:text-brand"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => onClearReply(review)}
                className="font-semibold text-red-500 hover:text-red-700"
              >
                삭제
              </button>
            </div>
          </div>
          <p className="mt-2 leading-relaxed text-gray-700">
            {maskKoreanNamesInText(review.reply)}
          </p>
        </div>
      ) : editing ? (
        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
          <textarea
            value={editDraft}
            onChange={(e) => setEditDraft(e.target.value)}
            rows={3}
            className={inputClass}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveEdit}
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600"
            >
              취소
            </button>
          </div>
        </div>
      ) : open ? (
        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder="리뷰에 대한 답변을 입력하세요."
            className={inputClass}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              답변 등록
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 text-sm font-semibold text-brand hover:underline"
        >
          + 답변 작성
        </button>
      )}
    </article>
  )
}

// Q&A 문의 카드 — status는 a 유무로 자동 계산
function InquiryCard({ inquiry, onAnswer, onClear, onToggleHide }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const status = inquiry.a ? '답변완료' : '대기'

  function save() {
    if (!draft.trim()) return
    onAnswer(inquiry, draft.trim())
    setDraft('')
    setOpen(false)
  }

  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm ${
        inquiry.hidden ? 'border-gray-200 opacity-60' : 'border-gray-100'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
              {inquiry.type}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                status === '답변완료'
                  ? 'bg-brand-light text-brand'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {status}
            </span>
            {inquiry.hidden && (
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-600">
                숨김
              </span>
            )}
          </div>
          <p className="mt-2 font-medium text-gray-900">Q. {inquiry.q}</p>
          <p className="mt-1 text-xs text-gray-400">{inquiry.author}</p>
        </div>
        <button
          type="button"
          onClick={() => onToggleHide(inquiry)}
          className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-brand hover:text-brand"
        >
          {inquiry.hidden ? '노출' : '숨김'}
        </button>
      </div>

      {inquiry.a ? (
        <div className="mt-3 rounded-xl bg-brand-bg p-4">
          <p className="text-xs font-bold text-brand">A. 관리자 답변</p>
          <p className="mt-1 leading-relaxed text-gray-700">
            {maskKoreanNamesInText(inquiry.a)}
          </p>
          <button
            type="button"
            onClick={() => onClear(inquiry)}
            className="mt-2 text-xs font-semibold text-gray-500 hover:text-brand"
          >
            답변 지우고 다시 작성
          </button>
        </div>
      ) : open ? (
        <div className="mt-3 space-y-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder="답변을 입력하세요."
            className={inputClass}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              답변 등록
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 text-sm font-semibold text-brand hover:underline"
        >
          + 답변 작성
        </button>
      )}
    </article>
  )
}

function AdminDashboardPage() {
  // 고객 리뷰는 서버에서 로드 (UserReviewPage·평점 집계와 같은 원천)
  const [userReviews, setUserReviews] = useState([])
  useEffect(() => {
    getReviews()
      .then((d) => setUserReviews(Array.isArray(d) ? d : []))
      .catch(() => setUserReviews([]))
  }, [])
  // 파트너 스토리도 서버에서 로드
  const [partnerStories, setPartnerStories] = useState([])
  useEffect(() => {
    getStories()
      .then((d) => setPartnerStories(Array.isArray(d) ? d : []))
      .catch(() => setPartnerStories([]))
  }, [])
  const [userQa, setUserQa] = useState([])
  const [partnerQa, setPartnerQa] = useState([])
  useEffect(() => {
    getQna('user')
      .then((d) => setUserQa(Array.isArray(d) ? d : []))
      .catch(() => setUserQa([]))
    getQna('partner')
      .then((d) => setPartnerQa(Array.isArray(d) ? d : []))
      .catch(() => setPartnerQa([]))
  }, [])
  // 공지 — NoticePage와 동일 키 (즉시 양방향 동기화)
  const [notices, setNotices] = useState([])
  useEffect(() => {
    getNotices()
      .then((d) => setNotices(Array.isArray(d) ? d : []))
      .catch(() => setNotices([]))
  }, [])
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [editingNoticeId, setEditingNoticeId] = useState(null)
  const [tab, setTab] = useState('match') // 사이드바 선택 카테고리

  // 무빙 프로젝트(갤러리·포트폴리오) + 브이로그
  const [projects, setProjects] = useState([])
  const [vlogs, setVlogs] = useState([])
  useEffect(() => {
    getProjects()
      .then((d) => setProjects(Array.isArray(d) ? d : []))
      .catch(() => setProjects([]))
    getVlogs()
      .then((d) => setVlogs(Array.isArray(d) ? d : []))
      .catch(() => setVlogs([]))
  }, [])
  const [projOpen, setProjOpen] = useState(false)
  const [editingProjId, setEditingProjId] = useState(null)
  const [vlogOpen, setVlogOpen] = useState(false)
  const [editingVlogId, setEditingVlogId] = useState(null)
  const editingProj = editingProjId
    ? projects.find((p) => p.id === editingProjId)
    : null
  const editingVlog = editingVlogId
    ? vlogs.find((v) => v.id === editingVlogId)
    : null

  // 견적·입찰 현황 (백엔드 — 입찰 포함)
  const [quotes, setQuotes] = useState([])
  useEffect(() => {
    getQuotes()
      .then((d) => setQuotes(Array.isArray(d) ? d : []))
      .catch(() => setQuotes([]))
  }, [])
  const editingNotice = editingNoticeId
    ? notices.find((n) => n.id === editingNoticeId)
    : null

  // 두 리뷰 큐를 합쳐 admin이 한 화면에서 관리, 시간 역순
  const allReviews = useMemo(() => {
    return [
      ...userReviews.map((r) => ({
        ...r,
        _kind: 'user',
        type: '고객',
        author: r.name,
        _sort: new Date(r.createdAt).getTime() || 0,
        displayDate: formatDate(r.createdAt),
      })),
      ...partnerStories.map((r) => ({
        ...r,
        _kind: 'partner',
        type: '파트너',
        author: r.company,
        _sort: new Date(r.createdAt).getTime() || 0,
        displayDate: formatDate(r.createdAt),
      })),
    ].sort((a, b) => b._sort - a._sort)
  }, [userReviews, partnerStories])

  const allInquiries = useMemo(() => {
    return [
      ...userQa.map((q) => ({
        ...q,
        _kind: 'user',
        type: '고객',
        author: q.name,
        _sort: new Date(q.createdAt).getTime() || 0,
      })),
      ...partnerQa.map((q) => ({
        ...q,
        _kind: 'partner',
        type: '파트너',
        author: q.name,
        _sort: new Date(q.createdAt).getTime() || 0,
      })),
    ].sort((a, b) => b._sort - a._sort)
  }, [userQa, partnerQa])

  // 매칭·리뷰·Q&A·공지 목록 페이지네이션 (5개씩)
  const matchPage = usePagination(quotes, 5)
  const reviewPage = usePagination(allReviews, 5)
  const qaPage = usePagination(allInquiries, 5)
  const noticePage = usePagination(notices, 5)

  // 통계
  const inProgress = quotes.filter((m) => m.status !== '완료').length
  const totalBids = quotes.reduce((sum, m) => sum + (m.bids?.length ?? 0), 0)
  const hiddenReviews = allReviews.filter((r) => r.hidden).length
  const pendingQa = allInquiries.filter((i) => !i.a).length

  // 리뷰 액션 — 어느 큐인지 _kind로 분기해 같은 키에 반영
  // 고객 리뷰(_kind==='user')는 서버 반영, 파트너 스토리는 기존 localStorage
  async function toggleHide(item) {
    if (item._kind === 'user') {
      try {
        const updated = await updateReview(item.id, { hidden: !item.hidden })
        setUserReviews((prev) =>
          prev.map((r) => (r.id === item.id ? updated : r)),
        )
      } catch {
        // 무시
      }
    } else {
      try {
        const updated = await updateStory(item.id, { hidden: !item.hidden })
        setPartnerStories((prev) =>
          prev.map((r) => (r.id === item.id ? updated : r)),
        )
      } catch {
        // 무시
      }
    }
  }
  async function replyReview(item, text) {
    if (item._kind === 'user') {
      try {
        const updated = await updateReview(item.id, { reply: text })
        setUserReviews((prev) =>
          prev.map((r) => (r.id === item.id ? updated : r)),
        )
      } catch {
        // 무시
      }
    } else {
      try {
        const updated = await updateStory(item.id, { reply: text })
        setPartnerStories((prev) =>
          prev.map((r) => (r.id === item.id ? updated : r)),
        )
      } catch {
        // 무시
      }
    }
    // 답변은 작성자 본인에게만 (관리자 자신 포함 다른 사용자에겐 노출 X)
    addNotification({
      type: 'reply',
      message: `${item.author}님의 리뷰에 관리자 답변이 달렸어요.`,
      link: item._kind === 'user' ? '/reviews' : '/partner/story',
      to: item.authorEmail || '',
    })
  }
  async function clearReply(item) {
    if (item._kind === 'user') {
      try {
        const updated = await updateReview(item.id, { reply: '' })
        setUserReviews((prev) =>
          prev.map((r) => (r.id === item.id ? updated : r)),
        )
      } catch {
        // 무시
      }
    } else {
      try {
        const updated = await updateStory(item.id, { reply: '' })
        setPartnerStories((prev) =>
          prev.map((r) => (r.id === item.id ? updated : r)),
        )
      } catch {
        // 무시
      }
    }
  }

  // Q&A 액션 (서버 반영, _kind로 user/partner 큐 분기)
  async function answer(item, text) {
    try {
      const updated = await updateQna(item.id, { a: text })
      const setter = item._kind === 'user' ? setUserQa : setPartnerQa
      setter((prev) => prev.map((q) => (q.id === item.id ? updated : q)))
    } catch {
      // 무시
    }
    // 답변은 질문자 본인에게만
    addNotification({
      type: 'reply',
      message: `${item.author}님의 질문에 관리자 답변이 달렸어요.`,
      link: item._kind === 'user' ? '/faq' : '/partner/faq',
      to: item.authorEmail || '',
    })
  }
  async function clearAnswer(item) {
    try {
      const updated = await updateQna(item.id, { a: '' })
      const setter = item._kind === 'user' ? setUserQa : setPartnerQa
      setter((prev) => prev.map((q) => (q.id === item.id ? updated : q)))
    } catch {
      // 무시
    }
  }
  async function toggleHideInquiry(item) {
    try {
      const updated = await updateQna(item.id, { hidden: !item.hidden })
      const setter = item._kind === 'user' ? setUserQa : setPartnerQa
      setter((prev) => prev.map((q) => (q.id === item.id ? updated : q)))
    } catch {
      // 무시
    }
  }

  // 공지 액션 — 작성·수정·삭제 (전체 사용자 알림, 관리자 본인 제외 X = 전체에게)
  const confirm = useConfirm()
  async function submitNotice(e) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const title = fd.get('title')?.toString().trim()
    const body = fd.get('body')?.toString().trim()
    if (!title || !body) return
    try {
      if (editingNoticeId) {
        const updated = await updateNotice(editingNoticeId, { title, body })
        setNotices((prev) =>
          prev.map((n) => (n.id === editingNoticeId ? updated : n)),
        )
        addNotification({
          type: 'notice',
          message: `공지가 수정되었어요: ${title}`,
          link: '/notice',
        })
        setEditingNoticeId(null)
      } else {
        const created = await createNotice({ title, body })
        setNotices((prev) => [created, ...prev])
        addNotification({
          type: 'notice',
          message: `새 공지: ${title}`,
          link: '/notice',
        })
      }
      form.reset()
      setNoticeOpen(false)
    } catch (err) {
      await confirm({
        title: '저장 실패',
        message: err.message || '공지 저장에 실패했습니다.',
        alertOnly: true,
      })
    }
  }
  async function removeNotice(id) {
    if (!(await confirm({ title: '공지 삭제', message: '이 공지를 삭제할까요?', danger: true })))
      return
    try {
      await deleteNotice(id)
      setNotices((prev) => prev.filter((n) => n.id !== id))
    } catch (err) {
      await confirm({
        title: '삭제 실패',
        message: err.message || '공지 삭제에 실패했습니다.',
        alertOnly: true,
      })
    }
  }
  function startEditNotice(n) {
    setEditingNoticeId(n.id)
    setNoticeOpen(true)
  }
  function cancelNotice() {
    setNoticeOpen(false)
    setEditingNoticeId(null)
  }

  // 무빙 프로젝트(갤러리·포트폴리오) 액션 — 사진은 FormData
  async function submitProject(e) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const title = fd.get('title')?.toString().trim()
    const excerpt = fd.get('excerpt')?.toString().trim()
    if (!title || !excerpt) return
    // 사진을 고르지 않았으면 빈 파일 항목 제거
    const img = fd.get('image')
    if (img instanceof File && img.size === 0) fd.delete('image')
    try {
      if (editingProjId) {
        const updated = await updateProject(editingProjId, fd)
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProjId ? updated : p)),
        )
        setEditingProjId(null)
      } else {
        const created = await createProject(fd)
        setProjects((prev) => [created, ...prev])
      }
      form.reset()
      setProjOpen(false)
    } catch (err) {
      await confirm({
        title: '저장 실패',
        message: err.message || '저장에 실패했습니다.',
        alertOnly: true,
      })
    }
  }
  async function removeProject(id) {
    if (!(await confirm({ title: '글 삭제', message: '이 글을 삭제할까요?', danger: true })))
      return
    try {
      await deleteProject(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      await confirm({
        title: '삭제 실패',
        message: err.message || '삭제에 실패했습니다.',
        alertOnly: true,
      })
    }
  }
  function startEditProj(p) {
    setEditingProjId(p.id)
    setProjOpen(true)
  }

  // 무빙 브이로그 액션 — 유튜브 URL
  async function submitVlog(e) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const title = fd.get('title')?.toString().trim()
    const videoUrl = fd.get('videoUrl')?.toString().trim()
    if (!title || !videoUrl) return
    try {
      if (editingVlogId) {
        const updated = await updateVlog(editingVlogId, { title, videoUrl })
        setVlogs((prev) =>
          prev.map((v) => (v.id === editingVlogId ? updated : v)),
        )
        setEditingVlogId(null)
      } else {
        const created = await createVlog({ title, videoUrl })
        setVlogs((prev) => [created, ...prev])
      }
      form.reset()
      setVlogOpen(false)
    } catch (err) {
      await confirm({
        title: '저장 실패',
        message: err.message || '저장에 실패했습니다.',
        alertOnly: true,
      })
    }
  }
  async function removeVlog(id) {
    if (!(await confirm({ title: '영상 삭제', message: '이 영상을 삭제할까요?', danger: true })))
      return
    try {
      await deleteVlog(id)
      setVlogs((prev) => prev.filter((v) => v.id !== id))
    } catch (err) {
      await confirm({
        title: '삭제 실패',
        message: err.message || '삭제에 실패했습니다.',
        alertOnly: true,
      })
    }
  }
  function startEditVlog(v) {
    setEditingVlogId(v.id)
    setVlogOpen(true)
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
        Admin
      </p>
      <h1 className="mt-1 text-3xl font-bold text-gray-900">관리자 대시보드</h1>
      <p className="mt-2 text-gray-600">
        견적·입찰·리뷰·문의를 한 화면에서 모니터링하고 직접 제어합니다.
      </p>

      {/* 통계 (Bento) */}
      <dl className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="진행 중 견적" value={inProgress} />
        <StatCard label="누적 입찰" value={totalBids} />
        <StatCard label="숨김 리뷰" value={hiddenReviews} />
        <StatCard label="미답변 Q&A" value={pendingQa} />
        <StatCard label="공지" value={notices.length} />
      </dl>

      <div className="mt-10 flex flex-col gap-6 md:flex-row">
        {/* 카테고리 사이드바 */}
        <aside className="md:w-44 md:shrink-0">
          <nav className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:gap-1 md:pb-0">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setTab(s.key)}
                className={`shrink-0 rounded-xl px-4 py-2 text-left text-sm font-semibold transition ${
                  tab === s.key
                    ? 'bg-brand text-white'
                    : 'text-gray-600 hover:bg-brand-bg hover:text-brand'
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* 본문 — 선택된 카테고리만 표시 */}
        <div className="min-w-0 flex-1">
          {tab === 'match' && (
            <>
      {/* ① 매칭/입찰 현황 */}
      <h2 className="mt-12 text-xl font-bold text-gray-900">매칭·입찰 현황</h2>
      <p className="mt-2 text-sm text-gray-500">
        진행 중인 견적 요청과 받은 입찰을 모니터링합니다.
      </p>
      <div className="mt-4 space-y-4">
        {matchPage.pageItems.map((m) => (
          <article
            key={m.id}
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
                    {m.moveType}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      m.status === '완료'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-gray-900">
                  {m.fromRegion} → {m.toRegion}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {m.name} · 이사 예정 {m.moveDate || '미정'}
                </p>
                <AddonChips addons={m.addons} />
              </div>
              <div className="text-right text-sm">
                <p className="text-gray-400">입찰 {m.bids.length}건</p>
                {m.bids.length > 0 && (
                  <p className="font-inter font-bold text-brand">
                    최저 {won(Math.min(...m.bids.map((b) => b.price)))}원
                  </p>
                )}
              </div>
            </div>
            {m.bids.length > 0 && (
              <div className="mt-4 border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-gray-500">입찰 내역</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {m.bids.map((b, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span className="text-gray-700">{b.company}</span>
                      <span className="font-inter font-semibold text-gray-900">
                        {won(b.price)}원
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        ))}
      </div>
      <Pagination
        page={matchPage.page}
        setPage={matchPage.setPage}
        totalPages={matchPage.totalPages}
        perPage={matchPage.perPage}
        setPerPage={matchPage.setPerPage}
      />
            </>
          )}
          {tab === 'reviews' && (
            <>
      {/* ② 리뷰 관리 — user/partner 통합 */}
      <h2 className="mt-12 text-xl font-bold text-gray-900">리뷰 관리</h2>
      <p className="mt-2 text-sm text-gray-500">
        사용자/파트너가 작성한 리뷰를 한 곳에서 관리합니다. 답변은 사용자
        페이지에도 즉시 반영됩니다.
      </p>
      <div className="mt-4 space-y-3">
        {allReviews.length === 0 ? (
          <Empty />
        ) : (
          reviewPage.pageItems.map((r) => (
            <ReviewItem
              key={`${r._kind}-${r.id}`}
              review={r}
              onToggleHide={toggleHide}
              onReply={replyReview}
              onClearReply={clearReply}
            />
          ))
        )}
      </div>
      <Pagination
        page={reviewPage.page}
        setPage={reviewPage.setPage}
        totalPages={reviewPage.totalPages}
        perPage={reviewPage.perPage}
        setPerPage={reviewPage.setPerPage}
      />
            </>
          )}
          {tab === 'qa' && (
            <>
      {/* ③ Q&A 답변 — user/partner 통합 */}
      <h2 className="mt-12 text-xl font-bold text-gray-900">Q&A 답변</h2>
      <p className="mt-2 text-sm text-gray-500">
        대기 중인 문의에 답변을 작성하면 답변완료로 전환되고, 사용자 페이지에도
        즉시 반영됩니다.
      </p>
      <div className="mt-4 space-y-3">
        {allInquiries.length === 0 ? (
          <Empty />
        ) : (
          qaPage.pageItems.map((i) => (
            <InquiryCard
              key={`${i._kind}-${i.id}`}
              inquiry={i}
              onAnswer={answer}
              onClear={clearAnswer}
              onToggleHide={toggleHideInquiry}
            />
          ))
        )}
      </div>
      <Pagination
        page={qaPage.page}
        setPage={qaPage.setPage}
        totalPages={qaPage.totalPages}
        perPage={qaPage.perPage}
        setPerPage={qaPage.setPerPage}
      />
            </>
          )}
          {tab === 'notice' && (
            <>
      {/* ④ 공지사항 — NoticePage와 동일 키 공유 */}
      <div className="mt-12 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">공지사항</h2>
          <p className="mt-2 text-sm text-gray-500">
            여기서 작성·수정·삭제한 내용은 공지사항 페이지에 즉시 반영됩니다.
          </p>
        </div>
        {!noticeOpen && (
          <button
            type="button"
            onClick={() => {
              setEditingNoticeId(null)
              setNoticeOpen(true)
            }}
            className="shrink-0 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            + 공지 작성
          </button>
        )}
      </div>

      {noticeOpen && (
        <form
          onSubmit={submitNotice}
          className="mt-4 space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              {editingNoticeId ? '공지 수정' : '공지 작성'}
            </h3>
            <button
              type="button"
              onClick={cancelNotice}
              className="text-sm text-gray-500 hover:text-brand"
            >
              닫기
            </button>
          </div>
          <label className="block">
            <span className="text-sm font-semibold text-gray-800">제목</span>
            <input
              type="text"
              name="title"
              required
              defaultValue={editingNotice?.title || ''}
              placeholder="공지 제목"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-800">내용</span>
            <textarea
              name="body"
              rows={5}
              required
              defaultValue={editingNotice?.body || ''}
              placeholder="공지 내용을 입력하세요."
              className={inputClass}
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:bg-brand-dark"
          >
            {editingNoticeId ? '수정 저장' : '공지 등록'}
          </button>
        </form>
      )}

      <div className="mt-4 space-y-3">
        {notices.length === 0 ? (
          <Empty />
        ) : (
          noticePage.pageItems.map((n) => (
            <article
              key={n.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {n.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">
                    {formatDate(n.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => startEditNotice(n)}
                    className="rounded-full border border-gray-300 px-3 py-1.5 font-semibold text-gray-600 transition hover:border-brand hover:text-brand"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => removeNotice(n.id)}
                    className="rounded-full border border-red-300 px-3 py-1.5 font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <p className="mt-3 leading-relaxed whitespace-pre-line text-gray-700">
                {n.body}
              </p>
            </article>
          ))
        )}
      </div>
      <Pagination
        page={noticePage.page}
        setPage={noticePage.setPage}
        totalPages={noticePage.totalPages}
        perPage={noticePage.perPage}
        setPerPage={noticePage.setPerPage}
      />
            </>
          )}

          {tab === 'projects' && (
            <>
              {/* 갤러리·포트폴리오 */}
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    갤러리·포트폴리오
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    등록한 글은 무빙 프로젝트 갤러리·포트폴리오 페이지에 바로 표시됩니다.
                  </p>
                </div>
                {!projOpen && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProjId(null)
                      setProjOpen(true)
                    }}
                    className="shrink-0 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
                  >
                    + 글 작성
                  </button>
                )}
              </div>

              {projOpen && (
                <form
                  onSubmit={submitProject}
                  className="mt-4 space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
                      {editingProjId ? '글 수정' : '글 작성'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setProjOpen(false)
                        setEditingProjId(null)
                      }}
                      className="text-sm text-gray-500 hover:text-brand"
                    >
                      닫기
                    </button>
                  </div>
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-800">종류</span>
                    <select
                      name="kind"
                      defaultValue={editingProj?.kind || 'gallery'}
                      className={inputClass}
                    >
                      <option value="gallery">갤러리</option>
                      <option value="portfolio">포트폴리오</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-800">제목</span>
                    <input
                      type="text"
                      name="title"
                      required
                      defaultValue={editingProj?.title || ''}
                      placeholder="글 제목"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-800">내용</span>
                    <textarea
                      name="excerpt"
                      rows={4}
                      required
                      defaultValue={editingProj?.excerpt || ''}
                      placeholder="이사 현장 이야기를 적어주세요."
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-800">
                      대표 사진 {editingProjId && '(새로 올리면 교체)'}
                    </span>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="mt-1 w-full text-sm text-gray-600"
                    />
                  </label>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:bg-brand-dark"
                  >
                    {editingProjId ? '수정 저장' : '글 등록'}
                  </button>
                </form>
              )}

              <div className="mt-4 space-y-3">
                {projects.length === 0 ? (
                  <Empty />
                ) : (
                  projects.map((p) => (
                    <article
                      key={p.id}
                      className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                    >
                      {p.image && (
                        <img
                          src={p.image}
                          alt={p.title}
                          className="h-16 w-16 shrink-0 rounded-xl object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <span className="inline-block rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-semibold text-brand-dark">
                              {p.kind === 'portfolio' ? '포트폴리오' : '갤러리'}
                            </span>
                            <h3 className="mt-1 text-lg font-bold text-gray-900">
                              {p.title}
                            </h3>
                            <p className="text-xs text-gray-400">
                              {formatDate(p.createdAt)}
                            </p>
                          </div>
                          <div className="flex gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => startEditProj(p)}
                              className="rounded-full border border-gray-300 px-3 py-1.5 font-semibold text-gray-600 transition hover:border-brand hover:text-brand"
                            >
                              수정
                            </button>
                            <button
                              type="button"
                              onClick={() => removeProject(p.id)}
                              className="rounded-full border border-red-300 px-3 py-1.5 font-semibold text-red-500 transition hover:bg-red-50"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                        <p className="mt-2 leading-relaxed whitespace-pre-line text-gray-700">
                          {p.excerpt}
                        </p>
                      </div>
                    </article>
                  ))
                )}
              </div>

              {/* 무빙 브이로그 */}
              <div className="mt-12 flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">무빙 브이로그</h2>
                  <p className="mt-2 text-sm text-gray-500">
                    유튜브 영상 링크를 등록하면 브이로그 페이지에 썸네일로 표시됩니다.
                  </p>
                </div>
                {!vlogOpen && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingVlogId(null)
                      setVlogOpen(true)
                    }}
                    className="shrink-0 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
                  >
                    + 영상 등록
                  </button>
                )}
              </div>

              {vlogOpen && (
                <form
                  onSubmit={submitVlog}
                  className="mt-4 space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
                      {editingVlogId ? '영상 수정' : '영상 등록'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setVlogOpen(false)
                        setEditingVlogId(null)
                      }}
                      className="text-sm text-gray-500 hover:text-brand"
                    >
                      닫기
                    </button>
                  </div>
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-800">제목</span>
                    <input
                      type="text"
                      name="title"
                      required
                      defaultValue={editingVlog?.title || ''}
                      placeholder="영상 제목"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-800">
                      유튜브 링크
                    </span>
                    <input
                      type="url"
                      name="videoUrl"
                      required
                      defaultValue={editingVlog?.videoUrl || ''}
                      placeholder="https://youtu.be/..."
                      className={inputClass}
                    />
                  </label>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:bg-brand-dark"
                  >
                    {editingVlogId ? '수정 저장' : '영상 등록'}
                  </button>
                </form>
              )}

              <div className="mt-4 space-y-3">
                {vlogs.length === 0 ? (
                  <Empty />
                ) : (
                  vlogs.map((v) => (
                    <article
                      key={v.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {v.title}
                        </h3>
                        <a
                          href={v.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs break-all text-brand hover:underline"
                        >
                          {v.videoUrl}
                        </a>
                        <p className="text-xs text-gray-400">
                          {formatDate(v.createdAt)}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => startEditVlog(v)}
                          className="rounded-full border border-gray-300 px-3 py-1.5 font-semibold text-gray-600 transition hover:border-brand hover:text-brand"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => removeVlog(v.id)}
                          className="rounded-full border border-red-300 px-3 py-1.5 font-semibold text-red-500 transition hover:bg-red-50"
                        >
                          삭제
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default AdminDashboardPage

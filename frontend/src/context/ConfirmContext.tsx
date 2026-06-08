import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'

// 사이트 디자인에 맞춘 확인/알림 모달 — window.confirm/alert 대체
// 사용: const confirm = useConfirm(); if (await confirm({ message })) { ... }
interface ConfirmOptions {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  alertOnly?: boolean
}

// 문자열이면 message로 취급
type ConfirmFn = (opts: ConfirmOptions | string) => Promise<boolean>

const ConfirmContext = createContext<ConfirmFn>(() => Promise.resolve(false))

function ConfirmModal({
  opts,
  onResult,
}: {
  opts: ConfirmOptions
  onResult: (result: boolean) => void
}) {
  const {
    title = '확인',
    message = '',
    confirmText = '확인',
    cancelText = '취소',
    danger = false,
    alertOnly = false,
  } = opts

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 백드롭 */}
      <button
        type="button"
        aria-label="닫기"
        onClick={() => onResult(false)}
        className="absolute inset-0 bg-black/40"
      />
      {/* 카드 */}
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {message && (
          <p className="mt-2 leading-relaxed whitespace-pre-line text-gray-600">
            {message}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          {!alertOnly && (
            <button
              type="button"
              onClick={() => onResult(false)}
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={() => onResult(true)}
            className={`rounded-full px-5 py-2 text-sm font-semibold text-white transition ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-brand hover:bg-brand-dark'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

interface ConfirmState {
  opts: ConfirmOptions
  resolve: (result: boolean) => void
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState | null>(null)

  // 문자열이면 message로 취급, 객체면 그대로
  const confirm = useCallback<ConfirmFn>((opts) => {
    const normalized: ConfirmOptions =
      typeof opts === 'string' ? { message: opts } : opts || {}
    return new Promise<boolean>((resolve) => {
      setState({ opts: normalized, resolve })
    })
  }, [])

  function handleResult(result: boolean) {
    setState((cur) => {
      if (cur) cur.resolve(result)
      return null
    })
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && <ConfirmModal opts={state.opts} onResult={handleResult} />}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  return useContext(ConfirmContext)
}

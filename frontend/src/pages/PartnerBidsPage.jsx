import { useAuth } from '../context/AuthContext'
import PartnerBidsList from '../components/PartnerBidsList'

function PartnerBidsPage() {
  const { user } = useAuth()

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">내 입찰 현황</h1>
      <p className="mt-2 text-gray-600">
        제출한 입찰과 낙찰 후 이사 진행 단계를 확인하고 단계를 진행하세요.
      </p>
      <div className="mt-6">
        <PartnerBidsList email={user?.username} />
      </div>
    </section>
  )
}

export default PartnerBidsPage

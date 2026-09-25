import { Users } from '@/components/Icons';
import AuthGatedLink from '@/components/common/AuthGatedLink'

export default function WeddingJoinCTA({ wedding }) {

  const guardJoinWedding = ({ isAuthenticated, user }) => {
    if (isAuthenticated && user.id === wedding.wid) {
      return {
          title: 'You Can’t Book Your Own Wedding',
          description: 'You’re the host of this wedding, so you don’t need to book it. Your guests can book and join your wedding from this page.',
          showLoginForm: false,
        }
    }else if(isAuthenticated && user.is_host){
      return {
              title: 'Unable to Join Wedding',
              description: 'Host accounts are only for creating and managing weddings. To join a wedding, please use a guest account.',
              showLoginForm: false,
            }
    }
    if (!isAuthenticated) {
      return { title: '', description: '', showLoginForm: true }
    }
    return null
  }

  return (
     <section className="celeb_main relative overflow-hidden bg-white py-12 sm:py-14"  style={{ backgroundImage: "url('/images/quote-bg.png')", backgroundSize: "cover",
              backgroundPosition: "center", }}>
      <div className="shell flex flex-col items-start gap-6 text-left lg:flex-row lg:items-center lg:justify-center lg:gap-16">
        <div>
          <h2 className="font-display text-[24px] font-bold text-wine-700 sm:text-[22px] md:text-[22px]">
            Your Wedding Deserves to Be Celebrated
          </h2>
          <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-wine-700">
            Share your love, welcoming guests from around the world to be part of your special
            day.
          </p>
        </div>

        <AuthGatedLink
          href={`/wedding/${wedding.id}/booking`}
          guard={guardJoinWedding}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-wine-700 px-6 text-sm font-semibold text-cream-50 shadow-sm transition-colors hover:bg-wine-600 focus:outline-none focus:ring-2 focus:ring-wine-300">
          <Users className="h-4 w-4" />
          Join Our Wedding
          <span aria-hidden="true">&rarr;</span>
        </AuthGatedLink>

        {/* <p className="hidden items-center gap-2 font-display text-[15px] italic text-cream-100/70 lg:flex">
          More than a wedding, a shared joy
          <Heart className="h-4 w-4 text-gold-400" />
        </p> */}
      </div>
    </section>
  );
}
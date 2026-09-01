import { ButtonLink } from '@/components/ui';
import { Wordmark } from '@/components/layout/Wordmark';

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-paper px-5">
      <div className="max-w-md text-center">
        <div className="flex justify-center">
          <Wordmark />
        </div>
        <h1 className="mt-8 font-display text-[2rem] leading-tight text-ink">This page is not here</h1>
        <p className="mt-3 leading-relaxed text-ink-2">
          The link may be out of date. Your dashboard has everything about your build in one place.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <ButtonLink to="/app">Go to my dashboard</ButtonLink>
          <ButtonLink to="/" variant="secondary">Back to the homepage</ButtonLink>
        </div>
      </div>
    </div>
  );
}

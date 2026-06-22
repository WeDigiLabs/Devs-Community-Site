/**
 * Mono micro-label. Optionally prefixed with a zero-padded index number and a
 * short rule, giving sections a "spec sheet / table of contents" rhythm.
 *
 *   ( 02 ) ──  WHY WE EXIST
 */
function Eyebrow({ index, children, className = '', light = false }) {
  return (
    <span className={`eyebrow ${light ? 'text-black/50' : ''} ${className}`}>
      {index != null && (
        <>
          <span className={light ? 'text-black' : 'text-white'}>
            {String(index).padStart(2, '0')}
          </span>
          <span
            className={`h-px w-6 ${light ? 'bg-black/30' : 'bg-white/30'}`}
            aria-hidden="true"
          />
        </>
      )}
      {children}
    </span>
  )
}

export default Eyebrow

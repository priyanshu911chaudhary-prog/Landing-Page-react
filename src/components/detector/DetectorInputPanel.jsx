import { useState, useCallback, useRef, useImperativeHandle, forwardRef } from 'react';

const EXAMPLE_CLAIMS = [
  {
    label: 'Moon composition claim',
    headline: 'Scientists discover the Moon is made of hollow titanium',
    article: '',
    url: '',
  },
  {
    label: 'AI singularity report',
    headline: 'GPT-7 achieves self-awareness according to internal OpenAI memo',
    article: '',
    url: '',
  },
  {
    label: 'Climate breakthrough',
    headline: 'New coral reef discovered thriving in warming Pacific waters',
    article: '',
    url: '',
  },
];

const MODES = [
  { key: 'headline', label: 'Headline' },
  { key: 'article', label: 'Article' },
  { key: 'url', label: 'URL' },
];

const MAX_ARTICLE_CHARS = 5000;

const DetectorInputPanel = forwardRef(({ onAnalyze, isProcessing = false }, ref) => {
  const [mode, setMode] = useState('headline');
  const [headline, setHeadline] = useState('');
  const [article, setArticle] = useState('');
  const [url, setUrl] = useState('');

  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    }
  }));

  const canSubmit =
    !isProcessing &&
    ((mode === 'headline' && headline.trim().length > 0) ||
      (mode === 'article' && article.trim().length > 0) ||
      (mode === 'url' && url.trim().length > 0));

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!canSubmit) return;
      onAnalyze?.({ headline: headline.trim(), article: article.trim(), url: url.trim(), mode });
    },
    [canSubmit, headline, article, url, mode, onAnalyze]
  );

  const handleExampleClick = useCallback((example) => {
    setHeadline(example.headline);
    setArticle(example.article);
    setUrl(example.url);
    if (example.headline) setMode('headline');
    else if (example.article) setMode('article');
    else if (example.url) setMode('url');
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative rounded-2xl border border-slate-700/50 bg-slate-950/50 backdrop-blur-sm overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        {/* Top glow accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ background: 'radial-gradient(900px 200px at 50% -10%, rgba(34,211,238,0.3), transparent 55%)' }}
        />

        {/* Header bar */}
        <div className="relative flex items-center justify-between px-5 py-3 border-b border-slate-700/40 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            </div>
            <span className="text-[10px] font-mono text-slate-500 tracking-[0.14em] uppercase">
              verification_console
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-50" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
            </span>
            <span className="text-[10px] font-mono text-cyan-300/80 tracking-[0.12em] uppercase">
              Ready
            </span>
          </div>
        </div>

        <div className="relative p-6 space-y-5">
          {/* Title */}
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight">
              Verify a Claim
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Choose an input type and submit for multi-source analysis
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-700/30 bg-slate-900/60 p-1">
            {MODES.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMode(m.key)}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  mode === m.key
                    ? 'bg-slate-800/80 text-white shadow-sm border border-slate-600/30'
                    : 'text-slate-500 border border-transparent hover:text-slate-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div>
            {mode === 'headline' && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                  <span className="h-px w-3 bg-cyan-500/40" />
                  Headline or claim
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Enter the claim or headline to verify…"
                  className="w-full rounded-xl border border-slate-700/40 bg-slate-900/40 px-4 py-3.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/15 focus:bg-slate-900/60 focus:shadow-[0_0_20px_rgba(34,211,238,0.06)]"
                  disabled={isProcessing}
                  autoFocus
                />
              </div>
            )}

            {mode === 'article' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                    <span className="h-px w-3 bg-cyan-500/40" />
                    Full article text
                  </label>
                  <span
                    className={`text-xs font-mono tabular-nums ${
                      article.length > MAX_ARTICLE_CHARS * 0.9
                        ? 'text-amber-400'
                        : 'text-slate-600'
                    }`}
                  >
                    {article.length.toLocaleString()} / {MAX_ARTICLE_CHARS.toLocaleString()}
                  </span>
                </div>
                <textarea
                  ref={inputRef}
                  value={article}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_ARTICLE_CHARS) {
                      setArticle(e.target.value);
                    }
                  }}
                  placeholder="Paste the full article or claim text here…"
                  rows={6}
                  className="w-full rounded-xl border border-slate-700/40 bg-slate-900/40 px-4 py-3.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/15 focus:bg-slate-900/60 focus:shadow-[0_0_20px_rgba(34,211,238,0.06)] resize-none"
                  disabled={isProcessing}
                  autoFocus
                />
              </div>
            )}

            {mode === 'url' && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                  <span className="h-px w-3 bg-cyan-500/40" />
                  Source URL
                </label>
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/article-to-verify"
                  className="w-full rounded-xl border border-slate-700/40 bg-slate-900/40 px-4 py-3.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/15 focus:bg-slate-900/60 focus:shadow-[0_0_20px_rgba(34,211,238,0.06)]"
                  disabled={isProcessing}
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Example Claims */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[10px] font-mono text-slate-500 tracking-[0.12em] uppercase">
                Quick-load samples
              </span>
              <div className="h-px flex-1 bg-slate-700/30" />
            </div>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_CLAIMS.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleExampleClick(ex)}
                  disabled={isProcessing}
                  className="group rounded-lg border border-slate-700/30 bg-slate-900/30 px-3 py-1.5 text-xs text-slate-400 transition-all duration-200 hover:border-cyan-500/25 hover:text-cyan-300 hover:bg-cyan-500/[0.04] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full group relative rounded-xl text-sm font-semibold px-6 py-4 transition-all duration-300 overflow-hidden ${
              canSubmit
                ? 'bg-cyan-500 text-white hover:bg-cyan-400 active:scale-[0.99] shadow-[0_8px_30px_rgba(34,211,238,0.2)]'
                : 'bg-slate-800/50 border border-slate-700/30 text-slate-600 cursor-not-allowed'
            }`}
          >
            {canSubmit && (
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            )}
            <span className="relative flex items-center justify-center gap-2.5">
              {isProcessing ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-white/80 animate-pulse" />
                  Analyzing…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Verify Authenticity
                </>
              )}
            </span>
          </button>
        </div>

        {/* Footer metadata */}
        <div className="flex items-center justify-between px-6 py-2.5 border-t border-slate-700/30 bg-slate-900/20">
          <span className="text-[9px] font-mono text-slate-600 tracking-[0.1em] uppercase">
            Model: verify-x v1
          </span>
          <span className="text-[9px] font-mono text-slate-600 tracking-[0.1em] uppercase">
            Pipeline: text only
          </span>
        </div>
      </div>
    </form>
  );
});

export default DetectorInputPanel;

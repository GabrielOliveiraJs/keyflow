import { useCallback, useMemo, useState } from 'react'
import './App.css'
import Brand from './components/Brand'
import MetricCard from './components/MetricCard'
import StatsDashboard from './components/StatsDashboard'
import TypingText from './components/TypingText'
import { categories, exercises, levelLabels, levels } from './data/exercises'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useTypingSession } from './hooks/useTypingSession'
import { formatTime, getFilteredExercises, getTypingMetrics } from './utils/typing'

const DEFAULT_EXERCISE = exercises[0]

function isValidSession(item) {
  return Boolean(
    item
    && typeof item === 'object'
    && typeof item.id === 'string'
    && typeof item.exerciseTitle === 'string'
    && typeof item.completedAt === 'string'
    && !Number.isNaN(new Date(item.completedAt).getTime())
    && Number.isFinite(Number(item.ppm))
    && Number.isFinite(Number(item.accuracy))
    && Number.isFinite(Number(item.typedChars))
    && Number.isFinite(Number(item.elapsedSeconds)),
  )
}

function App() {
  const [page, setPage] = useState('practice')
  const [category, setCategory] = useState('Todas')
  const [level, setLevel] = useState('todos')
  const [mode, setMode] = useState('free')
  const [duration, setDuration] = useState(60)
  const [exercise, setExercise] = useState(DEFAULT_EXERCISE)
  const [storedSessions, setSessions] = useLocalStorage('keyflow:sessions:v1', [])
  const sessions = useMemo(
    () => (Array.isArray(storedSessions) ? storedSessions.filter(isValidSession) : []),
    [storedSessions],
  )
  const [goal, setGoal] = useLocalStorage('keyflow:goal:v1', 40)
  const [lastResult, setLastResult] = useState(null)

  const filteredExercises = useMemo(
    () => getFilteredExercises(exercises, category, level),
    [category, level],
  )

  const handleFinish = useCallback((result) => {
    setLastResult(result)
    setSessions((current) => {
      const validSessions = Array.isArray(current) ? current.filter(isValidSession) : []
      return [...validSessions, { ...result, id: `${Date.now()}-${result.exerciseId}` }].slice(-50)
    })
  }, [setSessions])

  const session = useTypingSession({ exercise, mode, duration, onFinish: handleFinish })
  const today = new Date()
  const todaySessions = sessions.filter((item) => {
    const completedAt = new Date(item.completedAt)
    return completedAt.getFullYear() === today.getFullYear()
      && completedAt.getMonth() === today.getMonth()
      && completedAt.getDate() === today.getDate()
  }).length
  const dailyChallengeProgress = Math.min(100, Math.round((todaySessions / 3) * 100))

  const liveMetrics = useMemo(
    () => getTypingMetrics(exercise.content, session.input, session.elapsed),
    [exercise.content, session.elapsed, session.input],
  )

  const selectExercise = (nextExercise) => {
    setExercise(nextExercise)
    setLastResult(null)
  }

  const handleCategoryChange = (nextCategory) => {
    const nextList = getFilteredExercises(exercises, nextCategory, level)
    setCategory(nextCategory)
    if (nextList.length && !nextList.some((item) => item.id === exercise.id)) {
      selectExercise(nextList[0])
    }
  }

  const handleLevelChange = (nextLevel) => {
    const nextList = getFilteredExercises(exercises, category, nextLevel)
    setLevel(nextLevel)
    if (nextList.length && !nextList.some((item) => item.id === exercise.id)) {
      selectExercise(nextList[0])
    }
  }

  const loadNextExercise = () => {
    const candidates = filteredExercises.filter((item) => item.id !== exercise.id)
    const pool = candidates.length ? candidates : filteredExercises
    if (!pool.length) return
    if (!candidates.length) {
      restartCurrentExercise()
      return
    }
    const nextIndex = Math.floor(Math.random() * pool.length)
    selectExercise(pool[nextIndex])
  }

  const restartCurrentExercise = () => {
    session.restartSession()
    setLastResult(null)
  }

  const handleGoalChange = (value) => {
    if (Number.isFinite(value)) setGoal(Math.min(200, Math.max(5, value)))
  }

  const clearHistory = () => {
    if (window.confirm('Tem certeza de que deseja apagar todo o histórico de sessões?')) {
      setSessions([])
      setLastResult(null)
    }
  }

  const exportHistory = () => {
    if (!sessions.length) return
    const headers = ['Data', 'Exercício', 'Categoria', 'Modo', 'PPM', 'Precisão', 'Erros', 'Caracteres', 'Tempo (s)']
    const rows = sessions.map((item) => [
      item.completedAt,
      item.exerciseTitle,
      item.category,
      item.mode === 'timed' ? 'Cronometrado' : 'Livre',
      item.ppm,
      item.accuracy,
      item.errors,
      item.typedChars,
      item.elapsedSeconds,
    ])
    const csv = [headers, ...rows].map((row) => row.map((field) => `"${String(field ?? '').replaceAll('"', '""')}"`).join(';')).join('\n')
    const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'keyflow-historico.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const isTimed = mode === 'timed'
  const displayTime = isTimed ? session.remaining : session.elapsed
  const completionMessage = lastResult?.reason === 'time'
    ? 'O tempo acabou. Veja seu resultado e tente novamente.'
    : 'Exercício concluído. Ótimo trabalho!'

  return (
    <div className="app-shell" id="inicio">
      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
      <header className="site-header">
        <div className="site-header__inner">
          <Brand />
          <nav className="main-nav" aria-label="Navegação principal">
            <button className={`nav-link ${page === 'practice' ? 'is-active' : ''}`} type="button" onClick={() => setPage('practice')} aria-current={page === 'practice' ? 'page' : undefined}>Treinar</button>
            <button className={`nav-link ${page === 'stats' ? 'is-active' : ''}`} type="button" onClick={() => setPage('stats')} aria-current={page === 'stats' ? 'page' : undefined}>Meu desempenho</button>
          </nav>
          <div className="header-status"><span className="status-dot" /> Prática inteligente</div>
        </div>
      </header>

      <main id="main-content" className="main-content">
        {page === 'practice' ? (
          <>
            <section className="hero-section">
              <div>
                <span className="eyebrow">SEU ESPAÇO DE PRÁTICA</span>
                <h1>Menos erros. Mais <span>fluidez.</span></h1>
                <p>Treine no seu ritmo, acompanhe sua evolução e conquiste uma digitação mais natural.</p>
              </div>
              <div className="hero-decoration" aria-hidden="true">
                <span className="hero-decoration__key">K</span>
                <span className="hero-decoration__spark">✳</span>
                <span className="hero-decoration__line" />
              </div>
            </section>

            <div className="practice-layout">
              <section className="practice-main" aria-label="Área de exercício">
                <div className="panel exercise-panel">
                  <div className="exercise-toolbar">
                    <div>
                      <span className="eyebrow">EXERCÍCIO ATUAL</span>
                      <h2>{exercise.title}</h2>
                      <div className="exercise-meta">
                        <span>{exercise.category}</span>
                        <span className={`difficulty difficulty--${exercise.difficulty}`}>{levelLabels[exercise.difficulty]}</span>
                      </div>
                    </div>
                    <button className="icon-button" type="button" onClick={loadNextExercise} disabled={!filteredExercises.length} aria-label="Escolher outro exercício" title="Outro exercício">↻</button>
                  </div>

                  <div className="exercise-filters">
                    <div className="filter-group">
                      <label htmlFor="category-filter">Categoria</label>
                      <select id="category-filter" value={category} onChange={(event) => handleCategoryChange(event.target.value)}>
                        {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>
                    <div className="filter-group">
                      <label htmlFor="level-filter">Dificuldade</label>
                      <select id="level-filter" value={level} onChange={(event) => handleLevelChange(event.target.value)}>
                        {levels.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                      </select>
                    </div>
                    <div className="filter-group filter-group--mode">
                      <label htmlFor="mode-filter">Modo de treino</label>
                      <select id="mode-filter" value={mode} onChange={(event) => { setMode(event.target.value); setLastResult(null) }}>
                        <option value="free">Treino livre</option>
                        <option value="timed">Teste cronometrado</option>
                      </select>
                    </div>
                    <div className="filter-group filter-group--exercise">
                      <label htmlFor="exercise-filter">Exercício</label>
                      <select
                        id="exercise-filter"
                        value={exercise.id}
                        onChange={(event) => {
                          const selectedExercise = filteredExercises.find((item) => item.id === Number(event.target.value))
                          if (selectedExercise) selectExercise(selectedExercise)
                        }}
                      >
                        {filteredExercises.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                      </select>
                    </div>
                    {isTimed && (
                      <div className="filter-group filter-group--duration">
                        <label htmlFor="duration-filter">Duração</label>
                        <select id="duration-filter" value={duration} onChange={(event) => { setDuration(Number(event.target.value)); setLastResult(null) }}>
                          <option value={60}>1 minuto</option>
                          <option value={120}>2 minutos</option>
                          <option value={180}>3 minutos</option>
                          <option value={300}>5 minutos</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <p className="exercise-description">{exercise.description}</p>
                  <div className="text-display">
                    <div className="text-display__heading"><span>Digite o texto abaixo</span><span>{liveMetrics.progress}% concluído</span></div>
                    <div className="progress-track progress-track--thin" role="progressbar" aria-label="Progresso do exercício" aria-valuemin="0" aria-valuemax="100" aria-valuenow={liveMetrics.progress}>
                      <span style={{ width: `${liveMetrics.progress}%` }} />
                    </div>
                    <TypingText referenceText={exercise.content} typedText={session.input} />
                    <div className="typing-legend" aria-label="Legenda de correção">
                      <span><i className="legend-dot legend-dot--correct" /> Correto</span>
                      <span><i className="legend-dot legend-dot--incorrect" /> Incorreto</span>
                      <span><i className="legend-dot legend-dot--current" /> Próximo caractere</span>
                    </div>
                  </div>

                  {session.isFinished ? (
                    <div className="result-banner" role="status">
                      <div className="result-banner__icon">✓</div>
                      <div className="result-banner__content">
                        <strong>{completionMessage}</strong>
                        <span>{lastResult?.ppm ?? liveMetrics.ppm} PPM · {lastResult?.accuracy ?? liveMetrics.accuracy}% de precisão · {lastResult?.errors ?? liveMetrics.errors} erros</span>
                      </div>
                      <button className="button button--primary" type="button" onClick={loadNextExercise}>Próximo exercício</button>
                    </div>
                  ) : (
                    <div className="typing-input-area">
                      <label htmlFor="typing-input">Sua digitação</label>
                      <textarea
                        id="typing-input"
                        value={session.input}
                        onChange={(event) => session.handleInput(event.target.value)}
                        placeholder={session.isPaused ? 'Treino pausado. Retome para continuar digitando.' : 'Comece a digitar aqui... O cronômetro inicia automaticamente.'}
                        spellCheck="false"
                        autoCapitalize="off"
                        autoComplete="off"
                        autoCorrect="off"
                        aria-describedby="typing-hint"
                        disabled={session.isFinished || session.isPaused}
                      />
                      <div className="typing-input-footer">
                        <span id="typing-hint">Dica: mantenha os olhos no texto e priorize a precisão.</span>
                        <span>{liveMetrics.typedChars} caracteres</span>
                      </div>
                    </div>
                  )}

                  <div className="exercise-footer">
                    <div className="timer-display"><span className="timer-display__icon">◷</span><div><small>{isTimed ? 'TEMPO RESTANTE' : 'TEMPO DECORRIDO'}</small><strong>{formatTime(displayTime)}</strong></div></div>
                    <div className="exercise-footer__actions">
                      <span className="session-state">{session.isActive ? '● Em andamento' : session.isPaused ? 'Ⅱ Pausado' : session.isFinished ? 'Sessão finalizada' : 'Aguardando início'}</span>
                      <div className="timer-actions">
                        <button className="button button--secondary" type="button" onClick={session.togglePause} disabled={!session.isActive && !session.isPaused}>{session.isActive ? 'Pausar' : 'Continuar'}</button>
                        <button className="button button--secondary" type="button" onClick={restartCurrentExercise}>Reiniciar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <aside className="practice-sidebar" aria-label="Indicadores do treino">
                <section className="panel live-panel">
                  <div className="panel-heading"><div><span className="eyebrow">ACOMPANHAMENTO</span><h2>Seu ritmo</h2></div><span className="live-badge"><i /> AO VIVO</span></div>
                  <div className="live-speed"><strong>{liveMetrics.ppm}</strong><span>PPM</span><small>palavras por minuto</small></div>
                  <div className="live-metrics-list">
                    <div><span>Precisão</span><strong>{liveMetrics.accuracy}%</strong></div>
                    <div><span>Caracteres corretos</span><strong>{liveMetrics.correctChars}</strong></div>
                    <div><span>Erros</span><strong className={liveMetrics.errors ? 'text-danger' : ''}>{liveMetrics.errors}</strong></div>
                  </div>
                </section>

                <section className="panel session-panel">
                  <span className="eyebrow">RESUMO DA SESSÃO</span>
                  <div className="session-summary"><span>Progresso</span><strong>{liveMetrics.progress}%</strong></div>
                  <div className="progress-track"><span style={{ width: `${liveMetrics.progress}%` }} /></div>
                  <div className="session-summary"><span>Caracteres digitados</span><strong>{liveMetrics.typedChars}</strong></div>
                  <div className="session-summary"><span>Meta pessoal</span><strong>{goal} PPM</strong></div>
                  <button className="text-link" type="button" onClick={() => setPage('stats')}>Ver meu desempenho <span>→</span></button>
                </section>

                <section className="panel challenge-panel" aria-labelledby="daily-challenge-title">
                  <div className="challenge-heading"><span className="tip-card__icon">✦</span><span className="eyebrow">DESAFIO DO DIA</span></div>
                  <strong id="daily-challenge-title">Complete 3 exercícios hoje</strong>
                  <p>Pequenas sessões frequentes ajudam a criar consistência.</p>
                  <div className="progress-track" role="progressbar" aria-label="Progresso do desafio diário" aria-valuemin="0" aria-valuemax="3" aria-valuenow={Math.min(todaySessions, 3)}><span style={{ width: `${dailyChallengeProgress}%` }} /></div>
                  <span className="challenge-count">{Math.min(todaySessions, 3)} de 3 sessões concluídas</span>
                </section>
                <div className="tip-card"><span className="tip-card__icon">⌁</span><div><strong>Uma dica para hoje</strong><p>Encontre um ritmo confortável. A precisão consistente é a base para ganhar velocidade.</p></div></div>
              </aside>
            </div>
          </>
        ) : (
          <StatsDashboard sessions={sessions} goal={goal} onGoalChange={handleGoalChange} onClear={clearHistory} onExport={exportHistory} />
        )}
      </main>

      <footer className="site-footer"><Brand /><span>Pratique com intenção. Evolua a cada tecla.</span><span>Seus dados ficam salvos neste navegador.</span></footer>
    </div>
  )
}

export default App

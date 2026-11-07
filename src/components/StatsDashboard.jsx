import MetricCard from './MetricCard'
import { formatTime } from '../utils/typing'

export default function StatsDashboard({ sessions, goal, onGoalChange, onClear, onExport }) {
  const totalSessions = sessions.length
  const bestPpm = sessions.reduce((best, session) => Math.max(best, session.ppm || 0), 0)
  const averageAccuracy = totalSessions
    ? Math.round(sessions.reduce((total, session) => total + (session.accuracy || 0), 0) / totalSessions)
    : 0
  const totalCharacters = sessions.reduce((total, session) => total + (session.typedChars || 0), 0)
  const totalSeconds = sessions.reduce((total, session) => total + (session.elapsedSeconds || 0), 0)
  const recentSessions = [...sessions].reverse().slice(0, 8)
  const goalProgress = bestPpm && goal ? Math.min(100, Math.round((bestPpm / goal) * 100)) : 0

  return (
    <section className="stats-page" aria-labelledby="stats-title">
      <div className="page-heading">
        <div>
          <span className="eyebrow">SEU DESEMPENHO</span>
          <h1 id="stats-title">Evolução que você pode medir.</h1>
          <p>Acompanhe seus resultados e descubra como sua prática está evoluindo.</p>
        </div>
        <div className="stats-actions">
          <button className="button button--secondary" type="button" onClick={onExport} disabled={!sessions.length}>Exportar CSV</button>
          <button className="button button--ghost-danger" type="button" onClick={onClear} disabled={!sessions.length}>Limpar histórico</button>
        </div>
      </div>

      <div className="metrics-grid metrics-grid--dashboard">
        <MetricCard label="Sessões concluídas" value={totalSessions} detail="Treinos registrados" icon="◷" />
        <MetricCard label="Melhor velocidade" value={`${bestPpm} PPM`} detail="Palavras por minuto" icon="↗" accent="violet" />
        <MetricCard label="Precisão média" value={`${averageAccuracy}%`} detail="Acertos nas sessões" icon="◎" accent="green" />
        <MetricCard label="Tempo praticado" value={formatTime(totalSeconds)} detail={`${totalCharacters.toLocaleString('pt-BR')} caracteres digitados`} icon="⌁" />
      </div>

      <div className="stats-layout">
        <section className="panel goal-panel" aria-labelledby="goal-title">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">PRÓXIMO PASSO</span>
              <h2 id="goal-title">Sua meta de velocidade</h2>
            </div>
            <span className="goal-icon" aria-hidden="true">✦</span>
          </div>
          <p>Defina uma meta pessoal de palavras por minuto. Sua melhor marca será comparada com esse objetivo.</p>
          <label className="goal-input-label" htmlFor="speed-goal">Meta de PPM</label>
          <div className="goal-input-wrap">
            <input id="speed-goal" type="number" min="5" max="200" step="5" value={goal} onChange={(event) => onGoalChange(Number(event.target.value))} />
            <span>PPM</span>
          </div>
          <div className="goal-progress-heading"><span>Progresso da meta</span><strong>{goalProgress}%</strong></div>
          <div className="progress-track" role="progressbar" aria-label="Progresso da meta de velocidade" aria-valuemin="0" aria-valuemax="100" aria-valuenow={goalProgress}>
            <span style={{ width: `${goalProgress}%` }} />
          </div>
          <span className="muted-copy">Melhor resultado: {bestPpm} PPM de {goal || 0} PPM</span>
        </section>

        <section className="panel history-panel" aria-labelledby="history-title">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">ATIVIDADE RECENTE</span>
              <h2 id="history-title">Últimas sessões</h2>
            </div>
            <span className="history-count">{totalSessions} no total</span>
          </div>
          {recentSessions.length ? (
            <div className="history-list">
              {recentSessions.map((session) => (
                <article className="history-item" key={session.id}>
                  <div className="history-item__main">
                    <strong>{session.exerciseTitle}</strong>
                    <span>{new Date(session.completedAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })} · {session.category}</span>
                  </div>
                  <div className="history-item__stats">
                    <strong>{session.ppm} <small>PPM</small></strong>
                    <span>{session.accuracy}% precisão</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">⌨</span>
              <strong>Seu histórico começa aqui</strong>
              <p>Conclua seu primeiro exercício para visualizar seus resultados.</p>
            </div>
          )}
        </section>
      </div>
    </section>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { getTypingMetrics } from '../utils/typing'

export function useTypingSession({ exercise, mode, duration, onFinish }) {
  const [input, setInput] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const startedAtRef = useRef(null)
  const elapsedBaseRef = useRef(0)
  const hasStartedRef = useRef(false)
  const finishedRef = useRef(false)

  // Soma os períodos ativos; o tempo em pausa não entra no cálculo.
  const getElapsedSeconds = useCallback(() => {
    const currentSegment = startedAtRef.current ? Date.now() - startedAtRef.current : 0
    return Math.floor((elapsedBaseRef.current + currentSegment) / 1000)
  }, [])

  const finishSession = useCallback((reason, finalElapsed, finalInput = input) => {
    if (finishedRef.current || !exercise) return
    finishedRef.current = true
    setIsActive(false)
    setIsFinished(true)

    const elapsedAtFinish = Number.isFinite(finalElapsed) ? finalElapsed : getElapsedSeconds()
    const metrics = getTypingMetrics(exercise.content, finalInput, elapsedAtFinish)
    onFinish?.({
      ...metrics,
      elapsedSeconds: elapsedAtFinish,
      exerciseId: exercise.id,
      exerciseTitle: exercise.title,
      category: exercise.category,
      difficulty: exercise.difficulty,
      mode,
      reason,
      completedAt: new Date().toISOString(),
    })
  }, [exercise, getElapsedSeconds, input, mode, onFinish])

  const restartSession = useCallback(() => {
    finishedRef.current = false
    hasStartedRef.current = false
    startedAtRef.current = null
    elapsedBaseRef.current = 0
    setInput('')
    setElapsed(0)
    setIsActive(false)
    setIsFinished(false)
  }, [])

  const pauseSession = useCallback(() => {
    if (!isActive || !startedAtRef.current) return
    elapsedBaseRef.current += Date.now() - startedAtRef.current
    startedAtRef.current = null
    const pausedAt = Math.floor(elapsedBaseRef.current / 1000)
    setElapsed(pausedAt)

    if (mode === 'timed' && pausedAt >= duration) {
      finishSession('time', duration)
      return
    }

    setIsActive(false)
  }, [duration, finishSession, isActive, mode])

  const resumeSession = useCallback(() => {
    if (!hasStartedRef.current || startedAtRef.current || finishedRef.current) return
    startedAtRef.current = Date.now()
    setIsActive(true)
  }, [])

  const togglePause = useCallback(() => {
    if (isActive) pauseSession()
    else resumeSession()
  }, [isActive, pauseSession, resumeSession])

  useEffect(() => {
    restartSession()
  }, [exercise?.id, mode, duration, restartSession])

  useEffect(() => {
    if (!isActive) return undefined

    const intervalId = window.setInterval(() => {
      const nextElapsed = getElapsedSeconds()
      setElapsed(nextElapsed)

      if (mode === 'timed' && nextElapsed >= duration) {
        finishSession('time', duration)
      }
    }, 200)

    return () => window.clearInterval(intervalId)
  }, [duration, finishSession, getElapsedSeconds, isActive, mode])

  useEffect(() => {
    if (input.length > 0 && !hasStartedRef.current && !isFinished) {
      hasStartedRef.current = true
      startedAtRef.current = Date.now()
      setIsActive(true)
    }
  }, [input, isFinished])

  useEffect(() => {
    if (!exercise || !input || isFinished) return
    if (Array.from(input).length >= Array.from(exercise.content).length) {
      const finalElapsed = Math.max(1, getElapsedSeconds())
      setElapsed(finalElapsed)
      finishSession('complete', finalElapsed)
    }
  }, [exercise, finishSession, getElapsedSeconds, input, isFinished])

  const handleInput = (value) => {
    if (isFinished || (hasStartedRef.current && !startedAtRef.current)) return
    setInput(value)
  }

  const remaining = mode === 'timed' ? Math.max(0, duration - elapsed) : null
  const isPaused = hasStartedRef.current && !isActive && !isFinished

  return {
    input,
    elapsed,
    remaining,
    isActive,
    isPaused,
    isFinished,
    handleInput,
    togglePause,
    restartSession,
  }
}

import test from 'node:test'
import assert from 'node:assert/strict'
import { formatTime, getFilteredExercises, getTypingMetrics } from '../src/utils/typing.js'

test('calcula caracteres corretos, erros e precisão', () => {
  const result = getTypingMetrics('casa azul', 'casa xzul', 60)

  assert.equal(result.typedChars, 9)
  assert.equal(result.correctChars, 8)
  assert.equal(result.errors, 1)
  assert.equal(result.accuracy, 89)
  assert.equal(result.progress, 100)
})

test('calcula PPM com base em cinco caracteres por palavra', () => {
  const result = getTypingMetrics('abcdefghij', 'abcdefghij', 30)
  assert.equal(result.ppm, 4)
})

test('mantém precisão em zero antes de qualquer digitação', () => {
  const result = getTypingMetrics('texto', '', 0)
  assert.equal(result.accuracy, 0)
  assert.equal(result.errors, 0)
})

test('não antecipa velocidade antes de completar o primeiro segundo', () => {
  const result = getTypingMetrics('teste', 't', 0)
  assert.equal(result.ppm, 0)
})

test('formata tempo em minutos e horas', () => {
  assert.equal(formatTime(0), '00:00')
  assert.equal(formatTime(125), '02:05')
  assert.equal(formatTime(3661), '01:01:01')
})

test('filtra exercícios por categoria e dificuldade', () => {
  const items = [
    { id: 1, category: 'Tecnologia', difficulty: 'iniciante' },
    { id: 2, category: 'Tecnologia', difficulty: 'avancado' },
    { id: 3, category: 'Natureza', difficulty: 'avancado' },
  ]

  assert.deepEqual(getFilteredExercises(items, 'Tecnologia', 'avancado'), [items[1]])
  assert.deepEqual(getFilteredExercises(items, 'Todas', 'avancado'), [items[1], items[2]])
})

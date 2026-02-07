import React, { useState, useEffect } from "react";
import { Modal } from "./Modal";

export function CoachInsightsCard({ insights, onAddExercise, styles, collapsed, onToggle, loading, error, onRefresh }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const hasInsights = insights.length > 0;
  if (!loading && !hasInsights && !error) return null;

  return (
    <div style={styles.card}>
      <div style={collapsed ? { ...styles.cardHeader, marginBottom: 0 } : styles.cardHeader} onClick={onToggle}>
        <div style={styles.cardTitle}>AI Coach</div>
        <span style={styles.badge}>
          {loading && !hasInsights ? '...' : `${insights.length} insight${insights.length !== 1 ? 's' : ''}`}
        </span>
        <span style={styles.collapseToggle}>{collapsed ? "\u25B6" : "\u25BC"}</span>
      </div>

      {!collapsed && (
        <>
          {error && (
            <div style={{ padding: '8px 12px', marginBottom: 8, fontSize: 13, opacity: 0.7, background: 'rgba(245,158,11,0.1)', borderRadius: 8 }}>
              {error}
            </div>
          )}

          {hasInsights ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, opacity: loading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
              {insights.map((insight, idx) => (
                <InsightItem
                  key={idx}
                  insight={insight}
                  isExpanded={expandedIndex === idx}
                  onToggle={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                  onAddExercise={onAddExercise}
                  styles={styles}
                />
              ))}
            </div>
          ) : loading ? (
            <div style={{ padding: '16px 0', textAlign: 'center', opacity: 0.6, fontSize: 14 }}>
              Analyzing your workouts...
            </div>
          ) : null}

          <div style={styles.coachFooter}>
            Powered by AI{loading ? ' \u2014 updating...' : ''}
            {onRefresh && !loading && (
              <>
                {' \u00B7 '}
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); onRefresh(); }}
                  style={{ color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Refresh
                </a>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function InsightItem({ insight, isExpanded, onToggle, onAddExercise, styles }) {
  const severityColors = {
    HIGH: '#ef4444',
    MEDIUM: '#f59e0b',
    LOW: '#3b82f6',
    INFO: '#10b981',
  };

  const suggestions = insight.suggestions || [];

  return (
    <div style={{
      ...styles.insightCard,
      borderLeft: `4px solid ${severityColors[insight.severity] || '#6b7280'}`
    }}>
      <button
        onClick={onToggle}
        style={styles.insightHeader}
        type="button"
      >
        <div style={{ flex: 1 }}>
          <div style={styles.insightTitle}>{insight.title || "Insight"}</div>
          <div style={styles.insightMessage}>{insight.message || ""}</div>
        </div>
        {suggestions.length > 0 && (
          <span style={styles.insightChevron}>
            {isExpanded ? '\u25BC' : '\u25B6'}
          </span>
        )}
      </button>

      {isExpanded && suggestions.length > 0 && (
        <div style={styles.insightSuggestions}>
          <div style={styles.suggestionsTitle}>Suggested exercises:</div>
          {suggestions.map((suggestion, i) => (
            <div key={i} style={styles.suggestionRow}>
              <div style={{ flex: 1 }}>
                <div style={styles.suggestionName}>{suggestion.exercise}</div>
                <div style={styles.suggestionGroup}>
                  {(suggestion.muscleGroup || "").replace(/_/g, ' ').toLowerCase()}
                </div>
              </div>
              <button
                onClick={() => onAddExercise(suggestion.exercise)}
                style={styles.addSuggestionBtn}
                type="button"
              >
                + Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AddSuggestedExerciseModal({ open, exerciseName, workouts, onCancel, onConfirm, styles }) {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(workouts[0]?.id || null);

  useEffect(() => {
    if (open && workouts.length > 0) {
      setSelectedWorkoutId(workouts[0].id);
    }
  }, [open, workouts]);

  if (!open) return null;

  return (
    <Modal open={open} title={`Add "${exerciseName}"`} onClose={onCancel} styles={styles}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={styles.fieldCol}>
          <label style={styles.label}>Add to which workout?</label>
          <select
            value={selectedWorkoutId || ''}
            onChange={(e) => setSelectedWorkoutId(e.target.value)}
            style={styles.textInput}
          >
            {workouts.map(w => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.category})
              </option>
            ))}
          </select>
        </div>

        <div style={styles.smallText}>
          This will add <b>"{exerciseName}"</b> to your selected workout. You can rename or remove it later.
        </div>

        <div style={styles.modalFooter}>
          <button style={styles.secondaryBtn} onClick={onCancel}>
            Cancel
          </button>
          <button
            style={styles.primaryBtn}
            onClick={() => onConfirm(selectedWorkoutId, exerciseName)}
            disabled={!selectedWorkoutId}
          >
            Add Exercise
          </button>
        </div>
      </div>
    </Modal>
  );
}

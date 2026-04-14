/**
 * app.js — Admissions Pre-Screening Simulator
 */

const state = {
  currentStep: 0,
  maxActivities: 5,
  activityCount: 1
};

const STEP_IDS = ['step-1', 'step-2', 'step-3', 'step-4'];
const WEIGHTS = {
  academic: 0.25,
  impact: 0.20,
  leadership: 0.20,
  initiative: 0.20,
  distinction: 0.15
};

function init() {
  const nextButtons = document.querySelectorAll('.next-button');
  nextButtons.forEach(button => button.addEventListener('click', handleNext));
  const backButtons = document.querySelectorAll('.back-button');
  backButtons.forEach(button => button.addEventListener('click', handleBack));
  document.getElementById('evaluate-btn').addEventListener('click', evaluateApplicant);
  document.getElementById('add-activity-btn').addEventListener('click', addActivityBlock);
  document.getElementById('activity-container').addEventListener('click', handleActivityContainerClick);
  renderActivityBlocks();
  updateStepIndicator();
  showStep(state.currentStep);
}

function handleNext(event) {
  const nextIndex = Number(event.target.dataset.nextStep);
  if (nextIndex >= 0 && nextIndex < STEP_IDS.length) {
    state.currentStep = nextIndex;
    updateStepIndicator();
    showStep(nextIndex);
  }
}

function handleBack(event) {
  const prevIndex = Number(event.target.dataset.prevStep);
  if (prevIndex >= 0 && prevIndex < STEP_IDS.length) {
    state.currentStep = prevIndex;
    updateStepIndicator();
    showStep(prevIndex);
  }
}

function showStep(index) {
  STEP_IDS.forEach((stepId, position) => {
    const stepElement = document.getElementById(stepId);
    if (!stepElement) return;
    stepElement.classList.toggle('active-step', position === index);
  });
}

function updateStepIndicator() {
  const indicator = document.getElementById('step-indicator');
  indicator.textContent = `Step ${state.currentStep + 1} of ${STEP_IDS.length}`;
}

function evaluateApplicant() {
  const values = collectFormValues();
  const signals = extractSignals(values);
  const rawScores = scoreDimensions(signals);
  const normalizedScores = normalizeScores(rawScores, signals.resourceContext);
  const overall = computeOverall(normalizedScores);
  const percentile = computePercentile(overall);
  const similarProfiles = findSimilarProfiles(normalizedScores);
  const recommendation = generateRecommendation(overall);
  const strengths = summarizeStrengths(normalizedScores);
  const weaknesses = summarizeWeaknesses(normalizedScores);

  renderResults({
    overall,
    percentile,
    recommendation,
    scores: normalizedScores,
    strengths,
    weaknesses,
    similarProfiles,
    context: values.resourceContext
  });
}

function collectFormValues() {
  return {
    gpa: Number(document.getElementById('gpa').value) || 0,
    schoolName: document.getElementById('school-name').value.trim(),
    country: document.getElementById('country').value.trim(),
    curriculum: document.getElementById('curriculum').value,
    activities: collectActivities(),
    resourceContext: document.getElementById('resource-context').value,
    statement: document.getElementById('statement').value.trim()
  };
}

function collectActivities() {
  const blocks = document.querySelectorAll('.activity-block');
  return Array.from(blocks).map(block => ({
    title: block.querySelector('.activity-title').value.trim(),
    category: block.querySelector('.activity-category').value,
    role: block.querySelector('.activity-role').value.trim(),
    hours: Number(block.querySelector('.activity-hours').value) || 0,
    level: block.querySelector('.activity-level').value,
    recognition: block.querySelector('.activity-recognition').value.trim(),
    description: block.querySelector('.activity-description').value.trim()
  })).filter(activity => activity.title || activity.role || activity.hours || activity.recognition || activity.description);
}

function renderActivityBlocks() {
  const container = document.getElementById('activity-container');
  container.innerHTML = '';
  const count = state.activityCount || 1;
  for (let index = 0; index < count; index += 1) {
    container.appendChild(createActivityBlock(index));
  }
  updateActivityControls();
}

function createActivityBlock(index) {
  const wrapper = document.createElement('div');
  wrapper.className = 'activity-block';
  wrapper.innerHTML = `
    <div class="activity-header">
      <span class="activity-label">Activity ${index + 1}</span>
      <button type="button" class="remove-activity-button hidden">Remove</button>
    </div>
    <div class="field-row">
      <label>Title</label>
      <input class="activity-title" type="text" placeholder="Activity title">
    </div>
    <div class="field-row">
      <label>Category</label>
      <select class="activity-category">
        <option value="Academic">Academic</option>
        <option value="Extracurricular">Extracurricular</option>
        <option value="Leadership">Leadership</option>
        <option value="Work/Internship">Work/Internship</option>
        <option value="Competition">Competition</option>
        <option value="Community">Community</option>
        <option value="Project">Project</option>
      </select>
    </div>
    <div class="field-row">
      <label>Role</label>
      <input class="activity-role" type="text" placeholder="Your role">
    </div>
    <div class="field-row activity-inline-row">
      <div>
        <label>Total hours</label>
        <input class="activity-hours" type="number" min="0" placeholder="Hours">
      </div>
      <div>
        <label>Level</label>
        <select class="activity-level">
          <option value="Individual">Individual</option>
          <option value="School">School</option>
          <option value="Regional">Regional</option>
          <option value="National">National</option>
          <option value="International">International</option>
        </select>
      </div>
    </div>
    <div class="field-row">
      <label>Recognition (optional)</label>
      <input class="activity-recognition" type="text" placeholder="Award, mention, or recognition">
    </div>
    <div class="field-row">
      <label>Impact / description</label>
      <textarea class="activity-description" rows="3" placeholder="Describe the impact of this activity."></textarea>
    </div>
  `;
  return wrapper;
}

function addActivityBlock() {
  const container = document.getElementById('activity-container');
  const currentCount = container.querySelectorAll('.activity-block').length;
  if (currentCount >= state.maxActivities) return updateActivityControls();
  container.appendChild(createActivityBlock(currentCount));
  updateActivityControls();
}

function handleActivityContainerClick(event) {
  if (!event.target.classList.contains('remove-activity-button')) return;
  removeActivityBlock(event.target);
}

function removeActivityBlock(button) {
  const container = document.getElementById('activity-container');
  const blocks = container.querySelectorAll('.activity-block');
  if (blocks.length <= 1) return;
  button.closest('.activity-block').remove();
  updateActivityControls();
}

function updateActivityControls() {
  const container = document.getElementById('activity-container');
  const blocks = container.querySelectorAll('.activity-block');
  const addButton = document.getElementById('add-activity-btn');
  const warning = document.getElementById('activity-warning');
  blocks.forEach((block, index) => {
    block.querySelector('.activity-label').textContent = `Activity ${index + 1}`;
    const removeButton = block.querySelector('.remove-activity-button');
    removeButton.classList.toggle('hidden', blocks.length <= 1);
  });
  if (blocks.length >= state.maxActivities) {
    addButton.disabled = true;
    warning.classList.remove('hidden');
  } else {
    addButton.disabled = false;
    warning.classList.add('hidden');
  }
}

function extractSignals(values) {
  const activitiesText = values.activities
    .map(activity => `${activity.title} ${activity.category} ${activity.role} ${activity.hours} ${activity.level} ${activity.recognition} ${activity.description}`)
    .join(' ');

  return {
    gpa: values.gpa,
    schoolName: values.schoolName,
    country: values.country,
    curriculum: values.curriculum,
    activities: values.activities,
    activitiesText,
    activityCount: values.activities.length,
    resourceContext: values.resourceContext,
    statement: values.statement
  };
}

function scoreDimensions(signals) {
  return {
    academic: scoreAcademic(signals.gpa, signals.curriculum),
    impact: scoreImpact(signals),
    leadership: scoreLeadership(signals),
    initiative: scoreInitiative(signals),
    distinction: scoreDistinction(signals)
  };
}

function scoreAcademic(gpa, curriculum) {
  const curriculumValue = curriculum === 'IB' || curriculum === 'AP' ? 2 : curriculum === 'National' ? 1 : 0;
  const raw = (gpa / 4) * 7 + curriculumValue * 1.5;
  return clamp(Math.round(raw), 0, 10);
}

function scoreImpact(signals) {
  if (!signals.activities || signals.activities.length === 0) return 0;

  const levelScore = {
    Individual: 4,
    School: 5,
    Regional: 7,
    National: 8,
    International: 9
  };

  const total = signals.activities.reduce((sum, activity) => {
    let activityScore = levelScore[activity.level] || 4;
    if (matchesAny(activity.description, ['impact', 'community', 'change', 'reach', 'solve', 'improve', 'support'])) {
      activityScore += 1;
    }
    if (activity.hours >= 80) activityScore += 1;
    return sum + activityScore;
  }, 0);

  const average = total / signals.activityCount;
  return clamp(Math.round(average), 0, 10);
}

function scoreLeadership(signals) {
  if (!signals.activities || signals.activities.length === 0) return 0;

  const leadershipKeywords = ['founder', 'president', 'captain', 'chair', 'director', 'lead', 'coordinator', 'organizer'];
  const leadershipActivities = signals.activities.filter(activity => {
    return activity.category === 'Leadership' || matchesAny(activity.role, leadershipKeywords);
  });

  const count = leadershipActivities.length;
  let score = count >= 3 ? 9 : count === 2 ? 7 : count === 1 ? 5 : 2;
  if (leadershipActivities.some(activity => matchesAny(activity.role, ['founder', 'lead', 'director', 'president', 'captain']))) {
    score += 1;
  }

  return clamp(score, 0, 10);
}

function scoreInitiative(signals) {
  if (!signals.activities || signals.activities.length === 0) return 0;

  const initiativeKeywords = ['founder', 'started', 'created', 'launched', 'organized', 'built', 'initiated'];
  const initiativeCount = signals.activities.filter(activity => matchesAny(activity.role, initiativeKeywords) || matchesAny(activity.description, initiativeKeywords)).length;
  let score = initiativeCount >= 3 ? 9 : initiativeCount === 2 ? 7 : initiativeCount === 1 ? 5 : 2;
  if (signals.activities.some(activity => activity.category === 'Project' || activity.category === 'Competition')) {
    score += 1;
  }

  return clamp(score, 0, 10);
}

function scoreDistinction(signals) {
  if (!signals.activities || signals.activities.length === 0) return 0;

  let score = 0;
  signals.activities.forEach(activity => {
    if (activity.recognition) score += 2;
    if (['National', 'International'].includes(activity.level)) score += 1;
    if (activity.category === 'Competition') score += 1;
  });

  const average = score / signals.activityCount;
  return clamp(Math.round(average), 0, 10);
}

function normalizeScores(rawScores, resourceContext) {
  const boost = resourceContext === 'low' ? 1 : resourceContext === 'medium' ? 0.5 : 0;
  return {
    academic: clamp(rawScores.academic + (resourceContext === 'low' ? 0.5 : 0), 0, 10),
    impact: clamp(rawScores.impact + boost, 0, 10),
    leadership: clamp(rawScores.leadership + boost, 0, 10),
    initiative: clamp(rawScores.initiative + boost, 0, 10),
    distinction: clamp(rawScores.distinction + boost, 0, 10)
  };
}

function computeOverall(scores) {
  const total = Object.keys(WEIGHTS).reduce((sum, key) => sum + scores[key] * WEIGHTS[key], 0);
  return Math.round(total * 10);
}

function computePercentile(overall) {
  const dataset = window.referenceApplicants || [];
  if (!dataset.length) return 0;
  const countBelow = dataset.filter(profile => profile.overallScore < overall).length;
  return Math.round((countBelow / dataset.length) * 100);
}

function findSimilarProfiles(scores) {
  const dataset = window.referenceApplicants || [];
  return dataset
    .map(profile => ({
      profile,
      distance: Math.sqrt(
        ['academic', 'impact', 'leadership', 'initiative', 'distinction'].reduce((sum, key) => sum + Math.pow(scores[key] - profile[key], 2), 0)
      )
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map(item => item.profile);
}

function renderResults(result) {
  const container = document.getElementById('results-dashboard');
  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="section-header">
      <span class="section-label">Results</span>
      <h2>Applicant evaluation summary</h2>
    </div>
    <div class="results-overview">
      <div class="score-panel">
        <p class="result-label">Overall Score</p>
        <p class="result-value">${result.overall}</p>
      </div>
      <div class="score-panel">
        <p class="result-label">Percentile</p>
        <p class="result-value">Top ${result.percentile}%</p>
      </div>
      <div class="score-panel recommendation-card ${result.recommendation}">
        <p class="result-label">Recommendation</p>
        <p class="result-value">${formatRecommendation(result.recommendation)}</p>
      </div>
    </div>
    <div class="breakdown-grid">
      ${renderBreakdown(result.scores)}
    </div>
    <div class="insights-grid">
      <div>
        <h3>Strengths</h3>
        ${renderList(result.strengths)}
      </div>
      <div>
        <h3>Weaknesses</h3>
        ${renderList(result.weaknesses)}
      </div>
    </div>
    <div class="similar-profiles">
      <h3>Most similar reference applicants</h3>
      ${renderSimilarProfiles(result.similarProfiles)}
    </div>
  `;
  container.scrollIntoView({ behavior: 'smooth' });
}

function renderBreakdown(scores) {
  return Object.entries(scores)
    .map(([key, value]) => `
      <div class="score-tile">
        <p class="score-title">${capitalize(key)}</p>
        <p class="score-number">${value}/10</p>
      </div>
    `)
    .join('');
}

function renderList(items) {
  if (!items.length) return '<p class="muted-copy">No strong signals identified in this area.</p>';
  return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
}

function renderSimilarProfiles(profiles) {
  if (!profiles.length) return '<p class="muted-copy">No comparison profiles available.</p>';
  return profiles
    .map(profile => `
      <div class="similar-card">
        <p><strong>Outcome:</strong> ${profile.outcome}</p>
        <p class="profile-summary">Academic ${profile.academic}, Impact ${profile.impact}, Leadership ${profile.leadership}, Initiative ${profile.initiative}, Distinction ${profile.distinction}</p>
      </div>
    `)
    .join('');
}

function generateRecommendation(overall) {
  if (overall >= 87) return 'strong_yes';
  if (overall >= 75) return 'yes';
  if (overall >= 60) return 'borderline';
  return 'no';
}

function formatRecommendation(key) {
  return {
    strong_yes: 'Strong yes',
    yes: 'Yes',
    borderline: 'Borderline',
    no: 'No'
  }[key];
}

function summarizeStrengths(scores) {
  const strengths = [];
  if (scores.academic >= 8) strengths.push('Strong academic preparation.');
  if (scores.impact >= 7) strengths.push('Demonstrates measurable activity impact.');
  if (scores.leadership >= 7) strengths.push('Clear leadership or initiative across activities.');
  if (scores.initiative >= 7) strengths.push('Evidence of self-started, ownership-based work.');
  if (scores.distinction >= 7) strengths.push('Activity profile shows strong recognition or reach.');
  return strengths;
}

function summarizeWeaknesses(scores) {
  const weaknesses = [];
  if (scores.academic <= 5) weaknesses.push('Academic profile may need stronger GPA or curriculum signal.');
  if (scores.impact <= 5) weaknesses.push('Impact could be strengthened through broader or deeper outcomes.');
  if (scores.leadership <= 5) weaknesses.push('Leadership evidence is limited across submitted activities.');
  if (scores.initiative <= 5) weaknesses.push('More initiative or ownership would increase this profile.');
  if (scores.distinction <= 5) weaknesses.push('Distinction is limited; add recognition or higher-level activity.');
  return weaknesses;
}

function matchesAny(text = '', terms = []) {
  return terms.some(term => text.toLowerCase().includes(term));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

document.addEventListener('DOMContentLoaded', init);

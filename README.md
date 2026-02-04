# Tire Shop Tracker — Mini Project (Learning-Oriented)

This project is a **learning-focused mini system** inspired by real-world asset and maintenance tracking platforms (like AssetOps), but intentionally **simplified** to reinforce core frontend and state-management concepts.

The goal is **not UI sophistication** or production readiness — the goal is to deeply understand **data flow, responsibilities, and logic**.

---

## 🎯 Project Objective

Build a **Tire Shop / Vehicle Maintenance Tracker** that clearly separates:

- **Current state** (vehicles)
- **Historical data** (services)

And forces understanding of:

- business logic vs UI
- derived data (dates)
- cache invalidation
- predictable flows

---

## 🧠 What This Project Teaches (Core Goals)

- Difference between **current state** and **history**
- Maintenance date calculations:
  - overdue
  - due soon
- React Query:
  - queries
  - mutations
  - cache invalidation
- React Hook Form + Zod:
  - validation
  - payload creation
- Ability to explain the full flow **without looking at code**

---

## 🧱 Tech Stack (Intentionally Minimal)

- React
- TypeScript
- TanStack React Query
- React Hook Form
- Zod
- date-fns
- localStorage (mock backend)

No backend, no Firebase, no server — **logic first**.

---

## 📦 Domain Model

### Vehicle (Current State)

Represents the **operational snapshot of today**.

Fields:
- `id`
- `name`
- `plate`
- `status` (active | maintenance | inactive)
- `lastServiceDate`
- `serviceIntervalDays`
- `nextServiceDate` (derived)

👉 Vehicles are **not history**.  
They are **what the dashboard needs right now**.

---

### ServiceRecord (History)

Represents **immutable historical events**.

Fields:
- `id`
- `vehicleId`
- `date`
- `type` (preventive | corrective)
- `notes?`

👉 Service records **only grow**.  
They are never edited or deleted.

---

## 🔁 Core Business Flow

### When a service is added:

1. A **ServiceRecord** is created (history)
2. The related **Vehicle** is updated:
   - `lastServiceDate`
   - `nextServiceDate` (recalculated)
3. Data is saved
4. React Query invalidates caches
5. UI automatically refreshes

This mirrors **real enterprise systems**.

---

## 📅 Date Logic (Critical Concept)

The system **never asks the user** for `nextServiceDate`.

Instead:

```text
nextServiceDate = lastServiceDate + serviceIntervalDays
```

This guarantees:
- consistency
- no manual errors
- predictable behavior

Maintenance status is derived as:
- **overdue** → date < today
- **due soon** → 0–30 days
- **ok** → >30 days

---

## 🗂️ Project Structure

```
src/
 ├─ types/          # Domain types (Vehicle, ServiceRecord)
 ├─ utils/          # Date logic (pure functions)
 ├─ data/           # "Backend" logic (localStorage)
 ├─ hooks/          # React Query layer
 ├─ components/     # Forms + lists (UI only)
 └─ pages/          # Home
```

Each layer has **one clear responsibility**.

---

## 🧭 Responsibilities by Layer

### UI (components / pages)
- Collect user input
- Display data
- Show loading / error states

❌ Does NOT:
- calculate dates
- write to storage
- decide business rules

---

### Forms (RHF + Zod)
- Validate inputs
- Build payloads
- Trigger mutations

---

### Hooks (React Query)
- Fetch data
- Execute mutations
- Invalidate caches

---

### Data Layer
- Applies business rules
- Calculates derived fields
- Writes to storage

---

## 🔑 Key Learning Outcomes

After this project, you should be able to explain:

- Why **services are history**
- Why **vehicles store current state**
- Where data is validated
- Where data is written
- Where data is recalculated
- Why cache invalidation exists
- How UI updates without manual state sync

---

## 🏁 Definition of Success

This project is complete when you can:

- Explain the full flow without reading code
- Create at least:
  - one mutation
  - one date helper
- Confidently answer:
  - who validates?
  - who writes?
  - who recalculates?
  - who updates the UI?

---

## 🚀 Status

✅ Completed  
✅ All core learning goals achieved  
✅ Ready to move on to the next project

---

## 👤 Author

Eduardo Visconti  
Frontend Developer  
Focused on **logic clarity**, **data flow**, and **real-world frontend architecture**.

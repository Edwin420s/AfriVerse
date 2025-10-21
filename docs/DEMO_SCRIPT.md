# AfriVerse - Demo Script for BGI25 Hackathon

**Project:** AfriVerse - Where Ancestral Knowledge Meets Artificial Intelligence  
**Track:** AGI + Cultural Memory  
**Duration:** 5 minutes  
**Presenter:** Edwin Mwiti

---

## 🎯 Demo Objectives

1. Show cultural knowledge submission flow (voice-first)
2. Demonstrate AGI symbolic reasoning (MeTTa atoms)
3. Prove blockchain provenance and decentralization
4. Highlight ethical consent and community validation
5. Showcase reasoning transparency and explainability

---

## 📋 Pre-Demo Checklist

### Technical Setup (30 min before)
- [ ] All services running (backend, frontend, agents)
- [ ] Database seeded with 3-5 sample entries
- [ ] MetaMask connected to Linea testnet
- [ ] Test wallet has testnet ETH
- [ ] IPFS gateway accessible
- [ ] Screen recording software ready
- [ ] Audio working for voice demo
- [ ] Browser tabs pre-opened:
  - Frontend (localhost:3000)
  - Prisma Studio (localhost:5555)
  - LineScan explorer
  - IPFS gateway

### Content Preparation
- [ ] Sample proverb prepared (Swahili)
- [ ] Screenshot of reasoning trace ready
- [ ] Architecture diagram visible
- [ ] Backend logs visible in terminal

---

## 🎬 Demo Script (5 Minutes)

### **[0:00 - 0:30] Opening Hook (30 seconds)**

> "Imagine you're an elder in rural Kenya, and you know medicinal plants that have healed your community for generations. How do we preserve that knowledge before it's lost? And how do we make sure AI systems understand it—not just translate it, but *reason* with it?"

**Screen:** Show landing page with mission statement

> "This is AfriVerse—a decentralized platform that uses symbolic AGI to preserve, translate, and protect African indigenous knowledge."

---

### **[0:30 - 2:00] Live Cultural Submission (90 seconds)**

**Action:** Click "Submit Knowledge" button

> "Let me show you how easy it is for anyone—even without tech skills—to contribute."

**Step 1: Choose Type**
- Select "Traditional Practice" or "Story"
- Show clear icons and accessibility

**Step 2: Voice Recording**
> "AfriVerse is voice-first because most indigenous knowledge is oral."

- Click microphone icon
- Record 10-second sample in Swahili:
  
  **Sample (Swahili):**  
  *"Wazee wanasema: 'Haraka haraka haina baraka.' Maana yake ni kwamba kufanya kitu kwa haraka hakuna manufaa. Tunapaswa kuwa na subira."*
  
  **English translation:**  
  *"Elders say: 'Haste has no blessings.' It means rushing brings no benefit. We must have patience."*

- Show recording visualization
- Play back recording

**Step 3: Metadata**
- Language: Swahili
- Community: Kikuyu
- Region: Central Kenya
- Show consent modal with clear explanations

**Step 4: License Selection**
- Choose "Community Only" license
- Explain cultural data sovereignty

**Step 5: Submit**
- Sign with MetaMask (show transaction)
- Show "Uploading to IPFS..." loader
- Display success with entry ID

> "Notice: The raw audio is stored on IPFS—decentralized and permanent. The metadata is anchored on Linea blockchain for provenance."

**Switch tabs briefly:**
- Show IPFS CID in backend logs
- Show entry in Prisma Studio with status "pending"

---

### **[2:00 - 3:15] AGI Symbolic Reasoning (75 seconds)**

> "Now here's where it gets interesting—AfriVerse doesn't just store the audio. It *understands* it using symbolic AI."

**Action:** Navigate to entry detail page

**Show 3 Processing Stages:**

**Stage 1: Transcription**
```
"Wazee wanasema: 'Haraka haraka haina baraka.' Maana yake..."
```
> "Our AI agents transcribed the Swahili audio using OpenAI Whisper."

**Stage 2: Symbolization (MeTTa Atoms)**
```metta
(proverb "haraka_haraka_haina_baraka")
(meaning "rushing_brings_no_benefit")
(teaches "patience")
(teaches "mindfulness")
(origin "kenya")
(language "swahili")
(community "kikuyu")
(cultural_value "patience")
(related_to "wisdom")
```

> "These aren't just tags—they're symbolic atoms. AGI can *reason* with them."

**Stage 3: Reasoning Trace**

Show reasoning panel with natural language explanation:

```
Query: "What do Kenyan elders teach about decision-making?"

Reasoning:
1. Found proverb: haraka_haraka_haina_baraka
2. Extracted value: patience
3. Inferred: Patient decision-making is valued
4. Related concepts: mindfulness, wisdom

Answer: Kenyan elders emphasize patience in decision-making, 
as reflected in the proverb "Haraka haraka haina baraka" 
(Haste has no blessings), teaching that rushing leads to poor outcomes.
```

> "This is explainable AI—you see *how* it reasoned, not just what it concluded."

---

### **[3:15 - 4:00] Community Validation & Blockchain (45 seconds)**

**Action:** Open validator dashboard

> "Cultural accuracy matters. So AfriVerse has community validators."

**Show:**
- Pending entry waiting for validation
- Validator can approve/reject with notes
- Reputation scores visible

**Action:** Approve the entry (click "Validate")

**Show blockchain transaction:**
- Open LineScan in new tab
- Search for contract address
- Show `EntryValidated` event with:
  - Entry ID
  - Validator address
  - Timestamp
  - Immutable on-chain

> "Once validated, it's anchored on Linea blockchain—permanent, transparent, and owned by the community, not a corporation."

---

### **[4:00 - 4:30] Knowledge Graph Exploration (30 seconds)**

**Action:** Navigate to Explore page

> "Here's where it all comes together."

**Show:**
- 3D knowledge graph visualization
- Nodes = cultural concepts (patience, wisdom, decision-making)
- Edges = relationships (teaches, related_to, originates_from)
- Click node to see connected entries

> "Anyone can query this knowledge. Researchers, educators, AI developers—but always respecting the licenses the community chose."

**Quick query demo:**
- Type: "Plants that treat burns in Kenya"
- Show instant results with reasoning trace
- Click through to see full entry with IPFS audio

---

### **[4:30 - 5:00] Closing Impact Statement (30 seconds)**

**Return to architecture slide**

> "AfriVerse solves three problems at once:
> 
> **1. Cultural Loss** — Indigenous knowledge is disappearing. We're capturing it.
> 
> **2. AI Bias** — Current AGI systems ignore non-Western knowledge. We're teaching them cultural wisdom.
> 
> **3. Data Colonization** — Big tech owns most AI training data. We're putting communities in control.
> 
> This isn't just preservation—it's *participation* in the AGI future. Because the elders who healed with aloe vera deserve a seat at the table when AI makes medical recommendations."

**Final Screen:** Show GitHub repo + demo URL

> "Thank you. AfriVerse is open source, and we'd love your feedback."

---

## 🎥 Camera & Screen Sharing Tips

### Screen Layout
- **Main screen:** Frontend browser (full screen)
- **Side monitor:** Terminal logs, Prisma Studio, blockchain explorer
- **Switch smoothly:** Practice transitions

### Pacing
- **Speak clearly:** Assume international audience
- **Pause after key points:** Let concepts sink in
- **Show, don't just tell:** Every claim = visual proof

### Energy
- **Start strong:** Hook in first 15 seconds
- **Vary tone:** Excited for demo, serious for impact
- **End with invitation:** "Let's build AGI for everyone."

---

## 🔧 Backup Plans

### If voice recording fails:
- Have pre-recorded audio file ready
- Upload via file input instead

### If blockchain is slow:
- Show pre-validated entry
- Reference transaction hash from earlier test

### If agents aren't running:
- Show pre-processed entry
- Explain agent architecture with diagram

### If internet drops:
- Have local IPFS gateway running
- Use cached demo data

---

## 📊 Metrics to Highlight (If Time)

- **Submission time:** < 2 minutes from recording to blockchain
- **IPFS storage:** Decentralized across 1000+ nodes
- **Gas cost:** ~$0.05 per entry on Linea L2
- **Reasoning speed:** < 3 seconds to query knowledge graph
- **Accessibility:** Voice-first, no login required
- **Transparency:** Full audit trail on-chain

---

## 🎤 Q&A Preparation

### Expected Questions:

**Q: "How do you prevent fake or inaccurate submissions?"**

A: "Three layers: (1) Community validators review all entries, (2) Reputation system penalizes bad actors, (3) Blockchain makes all changes auditable—you can trace who validated what."

**Q: "What if someone uploads copyrighted or sacred content?"**

A: "We have a tiered license system—contributors choose 'Community Only,' 'Research Only,' or 'Open Access.' Sacred knowledge can be restricted. Plus, validators flag sensitive content."

**Q: "How do you fund long-term storage and compute?"**

A: "IPFS is decentralized—once pinned by multiple nodes, it persists. For compute, we're using Cudos/ASI Cloud credits. Long-term, we'll seek grants from cultural preservation orgs."

**Q: "Can this scale beyond Kenya/Africa?"**

A: "Absolutely. The architecture is federated—any community can run their own AfriVerse node, use their own validators, and preserve their own knowledge while connecting to the global graph."

**Q: "How is this different from Wikipedia?"**

A: "Wikipedia is text-first, centralized, and requires tech literacy. AfriVerse is voice-first, decentralized, blockchain-verified, and uses AGI for symbolic reasoning—not just storage."

---

## 📝 Post-Demo Talking Points

### For Judges:
- "We've integrated 7 cutting-edge technologies: MeTTa, SingularityNET, Fetch.AI agents, Linea zkEVM, IPFS, Prisma, Next.js—all working together."
- "This isn't vaporware—it runs end-to-end today."
- "Code is on GitHub, contracts are on testnet, demo is live."

### For Technical Audience:
- "We chose symbolic AI (MeTTa) over pure neural nets because reasoning needs to be explainable and auditable."
- "Linea L2 gives us sub-cent transaction costs—critical for community adoption."
- "uAgents architecture makes it easy to add new languages and processing pipelines."

### For Cultural Impact Audience:
- "We designed this *with* communities, not *for* them. Consent is mandatory, licenses are flexible, validators are local."
- "Every design choice—voice-first UI, local language support, community ownership—reflects input from elders and cultural leaders."

---

## 🏆 Winning Elements to Emphasize

1. **Technical Excellence:** 7 technologies seamlessly integrated
2. **Real-World Impact:** Solves actual cultural preservation problem
3. **Ethical AI:** Consent, transparency, community control
4. **AGI Alignment:** Teaches AGI cultural wisdom, not just data
5. **Decentralization:** No single point of failure or control
6. **Scalability:** Federated architecture, L2 blockchain
7. **Accessibility:** Voice-first, elder-friendly UX
8. **Completeness:** Full stack—frontend, backend, agents, contracts, demo

---

## 🎬 Video Recording Checklist

### Before Recording:
- [ ] Clean desktop (close unnecessary apps)
- [ ] Disable notifications
- [ ] Test microphone levels
- [ ] Clear browser cache
- [ ] Reset demo data to clean state
- [ ] Have water nearby

### During Recording:
- [ ] Smile (even though it's voiceover—energy translates)
- [ ] Speak at 75% speed (easier to understand)
- [ ] Pause 2 seconds between sections (easier to edit)
- [ ] If you mess up, pause, restart sentence (edit later)

### After Recording:
- [ ] Watch full recording before submitting
- [ ] Check audio levels throughout
- [ ] Verify all demos worked as shown
- [ ] Add captions/subtitles (accessibility + judges may watch muted)
- [ ] Export in 1080p MP4
- [ ] Upload to YouTube (unlisted) + submit link

---

## 📅 Practice Schedule

### Day Before Demo:
- **Run-through 1:** With bugs allowed (identify issues)
- **Fix any bugs found**
- **Run-through 2:** Smooth demo (time it)
- **Adjust script:** Cut if over 5 min, add if under 4 min
- **Run-through 3:** Final dress rehearsal (record it)

### Day of Demo:
- **Morning:** Quick system check, don't change code
- **1 hour before:** Final practice (just narration, no recording)
- **30 min before:** Set up screen recording, test audio
- **Record:** Do 2-3 takes, pick best one
- **Submit:** Upload and breathe

---

**Good luck! You've built something amazing—now show the world. 🚀**

*AfriVerse - Where Ancestral Knowledge Meets Artificial Intelligence*

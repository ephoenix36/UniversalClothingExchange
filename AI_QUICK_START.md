# 🎯 Universal Clothing Exchange - Quick Start Guide for AI Agents

**Location**: `c:\Users\ephoe\Documents\Coding_Projects\UniversalClothingExchange`  
**Full Instructions**: See `AI_AGENT_DEVELOPMENT_INIT.md`

---

## ⚡ Immediate Actions

### 1. Start Development Server
```bash
cd c:\Users\ephoe\Documents\Coding_Projects\UniversalClothingExchange
pnpm dev
```

### 2. Execute First Research Task
```typescript
mcp_agents_execute_agent({
  agentId: "creative-ideation-agent",
  maxTokens: 4000,
  prompt: `**shadcn/ui Component Research for Universal Clothing Exchange**

Research ALL shadcn/ui components and create a catalog with:
- Component name and documentation link
- Use cases in clothing swap platform
- Priority level (High/Medium/Low)
- Installation commands
- Example implementations

Focus on:
- Data tables for wardrobe management
- Forms for item uploads
- Dialogs/Sheets for modals
- Cards for item display
- Carousels for image galleries
- Badges for statuses
- Progress for match scores
- Tabs for navigation

Output: Complete component mapping document`
})
```

---

## 🏗️ Development Phases

### Phase 1: Foundation (4 hours)
- shadcn/ui component research
- Codebase analysis
- Development roadmap creation

### Phase 2: Core Features (15 hours)
- Virtual Wardrobe System
- Smart Matching Engine
- Swap Management System

### Phase 3: Advanced Features (19 hours)
- User Dashboard & Analytics
- Community Features
- AI-Powered Enhancements

### Phase 4: Polish (12 hours)
- Performance Optimization
- Testing & QA
- Documentation & Deployment

---

## 🤖 Agent Team Patterns

### Frontend Team
```typescript
agents: [
  { id: "tech-infrastructure-advisor" },
  { id: "product-innovation-advisor" },
  { id: "creative-ideation-agent" }
]
```

### Backend Team
```typescript
agents: [
  { id: "tech-infrastructure-advisor" },
  { id: "legal-compliance-advisor" },
  { id: "business-ops-advisor" }
]
```

### QA Team
```typescript
agents: [
  { id: "tech-infrastructure-advisor" },
  { id: "product-innovation-advisor" },
  { id: "financial-strategy-advisor" }
]
```

---

## 🎨 shadcn/ui Priority Components

### High Priority (Install First)
1. **Data Table** - Wardrobe management
2. **Form** - Item uploads, user settings
3. **Dialog** - Item details, confirmations
4. **Card** - Item display, user profiles
5. **Button** - Actions everywhere
6. **Input/Textarea** - All form fields
7. **Select/Combobox** - Filters, dropdowns
8. **Badge** - Status indicators
9. **Avatar** - User profiles
10. **Toast/Sonner** - Notifications

### Medium Priority
11. **Carousel** - Image galleries
12. **Tabs** - Navigation sections
13. **Progress** - Match scores, loading
14. **Skeleton** - Loading states
15. **Sheet** - Side panels
16. **Hover Card** - Quick previews
17. **Popover** - Context menus
18. **Separator** - Visual dividers
19. **Toggle Group** - View switchers
20. **Calendar/Date Picker** - Availability

### Low Priority (As Needed)
21. **Command** - Quick actions
22. **Context Menu** - Right-click actions
23. **Menubar** - Admin features
24. **Collapsible** - FAQ sections
25. **Resizable** - Split views

---

## 📋 Feature Development Template

```typescript
mcp_agents_execute_workflow_async({
  workflowId: "feature-name",
  name: "Feature Description",
  timeoutMs: 3600000, // 1 hour
  steps: [
    // Step 1: Design
    {
      id: "design",
      type: "agent",
      config: {
        agentId: "product-innovation-advisor",
        prompt: "Design UX/UI with shadcn/ui component mapping"
      }
    },
    // Step 2: Database
    {
      id: "database",
      type: "agent",
      config: {
        agentId: "tech-infrastructure-advisor",
        prompt: "Design Prisma schema with relations and indexes"
      }
    },
    // Step 3: API
    {
      id: "api",
      type: "agent",
      config: {
        agentId: "tech-infrastructure-advisor",
        prompt: "Build Next.js API routes with validation"
      }
    },
    // Step 4: Frontend (Parallel)
    {
      id: "frontend",
      type: "parallel",
      config: {
        branches: [
          { id: "component-a", type: "agent", ... },
          { id: "component-b", type: "agent", ... },
          { id: "component-c", type: "agent", ... }
        ]
      }
    },
    // Step 5: Integration
    {
      id: "integration",
      type: "agent",
      config: {
        agentId: "tech-infrastructure-advisor",
        prompt: "Connect all pieces, add error handling, optimize"
      }
    },
    // Step 6: Testing
    {
      id: "testing",
      type: "agent",
      config: {
        agentId: "tech-infrastructure-advisor",
        prompt: "Create comprehensive test suite"
      }
    }
  ]
})

// Get results
const result = await mcp_agents_wait_for({
  handleId: "feature-name",
  timeoutMs: 3600000
})
```

---

## 🛠️ Essential Skills to Create

### 1. shadcn-component-builder
```typescript
mcp_agents_create_skill({
  id: "shadcn-component-builder",
  name: "shadcn/ui Component Builder",
  config: {
    toolkits: ["agent-development", "structured-output"],
    systemPrompt: "Expert at building React components with shadcn/ui, TypeScript, and accessibility",
    rules: [
      { id: "typescript-required", priority: 100 },
      { id: "accessibility-required", priority: 95 },
      { id: "shadcn-ui-only", priority: 90 }
    ]
  }
})
```

### 2. api-route-builder
Build Next.js API routes with Whop auth, Zod validation, error handling

### 3. prisma-schema-designer
Design database schemas with relations, indexes, and constraints

### 4. test-suite-creator
Generate Vitest unit tests and Playwright E2E tests

### 5. performance-optimizer
Analyze and optimize bundle size, database queries, API responses

---

## 📊 Key Metrics to Track

### Development Progress
- [ ] Components created
- [ ] API routes built
- [ ] Database models defined
- [ ] Tests written (target >80% coverage)
- [ ] Features completed

### Code Quality
- [ ] TypeScript strict mode: No errors
- [ ] Biome lint: No warnings
- [ ] Test coverage: >80%
- [ ] Bundle size: <500KB initial
- [ ] Lighthouse score: >90

### User Experience
- [ ] Mobile responsive: All pages
- [ ] Accessibility: WCAG AA compliant
- [ ] Performance: <2s page load
- [ ] Error handling: All edge cases
- [ ] Loading states: All async operations

---

## 🚦 Quality Gates

### Before Feature Complete
1. ✅ All tests passing
2. ✅ Type checking clean
3. ✅ Lint errors resolved
4. ✅ Accessibility tested
5. ✅ Performance profiled
6. ✅ Security validated
7. ✅ Documentation updated
8. ✅ Code reviewed

---

## 🎬 First Day Workflow

**Hour 1-2: Research & Planning**
```typescript
// Execute shadcn research
mcp_agents_execute_agent({
  agentId: "creative-ideation-agent",
  prompt: "Complete shadcn/ui component catalog"
})

// Analyze codebase
mcp_agents_execute_agent({
  agentId: "tech-infrastructure-advisor",
  prompt: "Analyze project structure and identify priorities"
})
```

**Hour 3-4: Start Wardrobe Feature**
```typescript
// Begin wardrobe development
mcp_agents_execute_workflow_async({
  workflowId: "wardrobe-feature",
  name: "Virtual Wardrobe System",
  steps: [...] // See full init doc
})
```

**Hour 5-8: Continue Core Features**
```typescript
// Smart matching system
// Swap management
// User profiles
```

---

## 💡 Pro Tips

1. **Use Async for Long Tasks**: Any workflow >5 minutes should be async
2. **Parallel Development**: Build multiple components simultaneously
3. **Iterative Refinement**: Use "rounds" mode for progressive enhancement
4. **Skill Reuse**: Create skills for patterns you use repeatedly
5. **shadcn/ui First**: Always check if shadcn/ui has what you need
6. **TypeScript Strict**: Catch errors early with strong typing
7. **Test As You Go**: Write tests alongside features, not after
8. **Mobile First**: Start responsive, don't retrofit
9. **Accessibility Baked In**: Add ARIA from the start
10. **Performance Budget**: Monitor bundle size continuously

---

## 📚 Key Resources

- **shadcn/ui Docs**: https://ui.shadcn.com/docs
- **Next.js 16 Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Whop SDK**: https://whop.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Project Style Guide**: `STYLE_GUIDE.md`
- **Setup Guide**: `SETUP.md`

---

## 🆘 Troubleshooting

### API Keys Not Working
```typescript
// Check environment variables
mcp_agents_execute_agent({
  agentId: "tech-infrastructure-advisor",
  prompt: "Diagnose API key issues and provide fix"
})
```

### Component Not Rendering
```typescript
// Debug component
mcp_agents_execute_agent({
  agentId: "creative-ideation-agent",
  prompt: "Debug [ComponentName] rendering issue with detailed analysis"
})
```

### Performance Issues
```typescript
// Performance audit
mcp_agents_execute_agent({
  agentId: "tech-infrastructure-advisor",
  prompt: "Run performance audit and provide optimization plan"
})
```

---

## ✅ Daily Checklist

### Morning Standup
- [ ] Review yesterday's progress
- [ ] Check test results
- [ ] Review blocked items
- [ ] Plan today's priorities
- [ ] Start first async workflow

### During Development
- [ ] Write tests alongside code
- [ ] Commit frequently with clear messages
- [ ] Monitor build performance
- [ ] Check accessibility continuously
- [ ] Document as you build

### Evening Wrap-up
- [ ] Generate progress report
- [ ] Update task tracker
- [ ] Document learnings
- [ ] Plan tomorrow's work
- [ ] Push all changes

---

## 🎯 Success Checklist

### Week 1
- [ ] All shadcn/ui components installed
- [ ] Virtual wardrobe complete
- [ ] Smart matching MVP working
- [ ] Swap initiation functional

### Week 2
- [ ] Full swap workflow operational
- [ ] User dashboard complete
- [ ] Community features MVP
- [ ] AI integration working

### Week 3
- [ ] All features complete
- [ ] >90% test coverage
- [ ] Performance optimized
- [ ] Documentation complete
- [ ] Ready for production

---

**Start Building Now! 🚀**

Execute first research task above and begin your journey to building an amazing sustainable fashion platform.

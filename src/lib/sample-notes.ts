import { Note } from './interfaces';

export const sampleNotes: Record<string, Note> = {
  "quarterly-review": {
    id: "quarterly-review",
    title: "Q4 2024 Performance Review",
    color: "blue",
    content: [
      {
        type: "marquee",
        content: [
          {
            content: ["Outstanding Quarter!", "Revenue Up 32%", "Team Exceeded Goals"],
            background: 1
          }
        ]
      },
      {
        type: "markdown",
        content: [
          {
            content: "# Executive Summary\n\nOur Q4 2024 performance exceeded all expectations with record-breaking results across multiple metrics. The team's dedication and strategic initiatives have positioned us for continued success in 2025.",
            background: 1,
            width: "2/3"
          },
          {
            content: "## Key Highlights\n\n- **Revenue Growth**: 32% increase YoY\n- **Customer Satisfaction**: 94% positive rating\n- **Team Productivity**: 28% improvement\n- **Market Expansion**: 3 new regions",
            background: 0,
            width: "1/3"
          }
        ]
      },
      {
        type: "graph",
        content: [
          {
            chartType: "area",
            chartData: [
              { month: "January", revenue: 850, expenses: 420, profit: 430 },
              { month: "February", revenue: 920, expenses: 450, profit: 470 },
              { month: "March", revenue: 1100, expenses: 520, profit: 580 },
              { month: "April", revenue: 1250, expenses: 580, profit: 670 },
              { month: "May", revenue: 1380, expenses: 620, profit: 760 },
              { month: "June", revenue: 1500, expenses: 650, profit: 850 }
            ],
            chartConfig: {
              xAxisKey: "month"
            },
            heading: "Financial Performance Trend",
            subheading: "Revenue, Expenses, and Profit (in $K)",
            description: "Consistent growth across all financial metrics with healthy profit margins",
            background: 1,
            width: "1/1"
          }
        ]
      },
      {
        type: "markdown",
        content: [
          {
            content: "## Action Items for Q1 2025\n\n1. **Expand Marketing Budget** - Increase by 25% to capitalize on momentum\n2. **Hire Additional Staff** - 5 new team members across engineering and sales\n3. **Launch New Product Line** - Target February release\n4. **Improve Customer Support** - Reduce response time to under 2 hours",
            background: 3,
            width: "1/2"
          },
          {
            content: "## Risk Assessment\n\n- **Market Competition**: Medium risk - new competitor entering market\n- **Economic Conditions**: Low risk - stable outlook\n- **Supply Chain**: Low risk - multiple suppliers secured\n- **Regulatory Changes**: Medium risk - new compliance requirements",
            background: 3,
            width: "1/2"
          }
        ]
      }
    ],
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2024-01-15T16:30:00Z")
  },

  "tech-conference": {
    id: "tech-conference",
    title: "TechCon 2024 - AI & Machine Learning Summit",
    color: "purple",
    content: [
      {
        type: "marquee",
        content: [
          {
            content: ["AI Revolution", "100+ Speakers", "3 Days of Innovation"],
            background: 4
          }
        ]
      },
      {
        type: "markdown",
        content: [
          {
            content: "# Day 1 Keynote: The Future of AI\n\n**Speaker**: Dr. Sarah Chen, OpenAI\n\n> \"We're not just building tools; we're creating partners for human intelligence.\"\n\n## Key Takeaways\n\n- Large Language Models are becoming more efficient and accessible\n- Multi-modal AI will be the next breakthrough\n- Ethical AI development is crucial for long-term success",
            background: 1,
            width: "1/1"
          }
        ]
      },
      {
        type: "graph",
        content: [
          {
            chartType: "bar",
            chartData: [
              { day: "Day 1", attendees: 2800, speakers: 35, sessions: 24 },
              { day: "Day 2", attendees: 3200, speakers: 42, sessions: 30 },
              { day: "Day 3", attendees: 2900, speakers: 38, sessions: 28 }
            ],
            chartConfig: {
              xAxisKey: "day"
            },
            heading: "Conference Participation",
            subheading: "Daily attendance and session metrics",
            description: "Peak attendance on Day 2 with highest speaker engagement",
            background: 1,
            width: "1/2"
          },
          {
            chartType: "pie",
            chartData: [
              { name: "AI/ML", value: 45 },
              { name: "Cloud", value: 28 },
              { name: "Security", value: 22 },
              { name: "Mobile", value: 15 }
            ],
            chartConfig: {
              dataKey: "value",
              nameKey: "name"
            },
            heading: "Session Topics Distribution",
            subheading: "Number of sessions by technology area",
            description: "AI/ML dominated the conference with 45 dedicated sessions",
            background: 3,
            width: "1/2"
          }
        ]
      },
      {
        type: "markdown",
        content: [
          {
            content: "## Notable Presentations\n\n### \"Democratizing AI Development\"\n- Speaker: Alex Rodriguez, Google\n- Key Point: No-code AI tools are making machine learning accessible to everyone\n- Demo: Building a chatbot in 10 minutes without coding\n\n### \"The Ethics of Artificial Intelligence\"\n- Speaker: Prof. Maria Santos, MIT\n- Key Point: We need global standards for AI development\n- Call to Action: Industry-wide collaboration on ethical guidelines",
            background: 1,
            width: "1/1"
          }
        ]
      },
      {
        type: "marquee",
        content: [
          {
            content: ["Next Year: TechCon 2025", "May 15-17, San Francisco", "Register Early!"],
            background: 5
          }
        ]
      }
    ],
    createdAt: new Date("2024-03-20T09:00:00Z"),
    updatedAt: new Date("2024-03-22T18:00:00Z")
  },

  "marketing-strategy": {
    id: "marketing-strategy",
    title: "2024 Digital Marketing Strategy Meeting",
    color: "green",
    content: [
      {
        type: "marquee",
        content: [
          {
            content: ["Digital First", "ROI Focused", "Data Driven Decisions"],
            background: 1
          }
        ]
      },
      {
        type: "markdown",
        content: [
          {
            content: "# Campaign Performance Analysis\n\n## Social Media Campaign Results\n\nOur recent social media push has shown exceptional results across all platforms. The video content strategy has proven particularly effective with engagement rates up 340% compared to static posts.\n\n**Top Performing Platforms:**\n- Instagram: 45% engagement rate\n- TikTok: 38% engagement rate\n- LinkedIn: 12% engagement rate (B2B focused)",
            background: 0,
            width: "1/2"
          },
          {
            content: "## Budget Allocation Recommendations\n\n### Q2 2024 Focus Areas\n\n1. **Video Content Creation** - 40% of budget\n2. **Influencer Partnerships** - 25% of budget\n3. **Paid Social Advertising** - 20% of budget\n4. **SEO & Content Marketing** - 15% of budget\n\n*Total Budget: $250,000*",
            background: 3,
            width: "1/2"
          }
        ]
      },
      {
        type: "graph",
        content: [
          {
            chartType: "line",
            chartData: [
              { week: "Week 1", impressions: 125000, clicks: 3200, conversions: 85 },
              { week: "Week 2", impressions: 148000, clicks: 4100, conversions: 120 },
              { week: "Week 3", impressions: 165000, clicks: 4800, conversions: 145 },
              { week: "Week 4", impressions: 178000, clicks: 5200, conversions: 168 },
              { week: "Week 5", impressions: 195000, clicks: 5800, conversions: 192 },
              { week: "Week 6", impressions: 210000, clicks: 6400, conversions: 225 }
            ],
            chartConfig: {
              xAxisKey: "week"
            },
            heading: "Campaign Performance Metrics",
            subheading: "Weekly tracking of key performance indicators",
            description: "Steady growth across all metrics with conversion rate improving from 2.7% to 3.5%",
            background: 1,
            width: "1/1"
          }
        ]
      },
      {
        type: "markdown",
        content: [
          {
            content: "## Customer Acquisition Analysis\n\n### Cost Per Acquisition by Channel\n\n- **Organic Search**: $23 CPA (Best performing)\n- **Social Media**: $35 CPA\n- **Email Marketing**: $18 CPA (Existing customers)\n- **Paid Search**: $42 CPA\n- **Display Advertising**: $67 CPA\n\n### Lifetime Value Insights\n\n- Average Customer LTV: $340\n- Payback Period: 3.2 months\n- Retention Rate: 78% (12 months)",
            background: 3,
            width: "2/3"
          },
          {
            content: "## Action Items\n\n- [ ] Increase video content production\n- [ ] Negotiate better rates with top influencers\n- [ ] A/B test new ad creatives\n- [ ] Launch referral program\n- [ ] Optimize landing pages for mobile\n- [ ] Implement retargeting campaigns",
            background: 4,
            width: "1/3"
          }
        ]
      }
    ],
    createdAt: new Date("2024-02-10T14:30:00Z"),
    updatedAt: new Date("2024-02-10T17:45:00Z")
  },

  "product-launch": {
    id: "product-launch",
    title: "CloudSync Pro - Product Launch Planning",
    color: "cyan",
    content: [
      {
        type: "marquee",
        content: [
          {
            content: ["CloudSync Pro", "Launch Date: April 1st", "Pre-orders Now Live!"],
            background: 3
          }
        ]
      },
      {
        type: "markdown",
        content: [
          {
            content: "# Product Overview\n\n**CloudSync Pro** is our next-generation cloud storage solution designed for enterprise customers. With advanced security features, unlimited storage, and real-time collaboration tools, it's positioned to capture 15% market share within the first year.\n\n## Key Features\n\n- **Unlimited Storage**: No caps, no limits\n- **Enterprise Security**: End-to-end encryption, compliance ready\n- **Real-time Collaboration**: Multiple users, instant sync\n- **Advanced Analytics**: Usage insights and reporting\n- **API Integration**: Connect with existing workflows",
            background: 0,
            width: "1/1"
          }
        ]
      },
      {
        type: "graph",
        content: [
          {
            chartType: "bar",
            chartData: [
              { phase: "Development", planned: 12, actual: 14, budget: 450000 },
              { phase: "Testing", planned: 4, actual: 3, budget: 120000 },
              { phase: "Marketing", planned: 6, actual: 6, budget: 200000 },
              { phase: "Launch", planned: 2, actual: 2, budget: 80000 }
            ],
            chartConfig: {
              xAxisKey: "phase"
            },
            heading: "Project Timeline & Budget",
            subheading: "Weeks planned vs actual, with budget allocation",
            description: "Development took 2 weeks longer than planned but testing was completed ahead of schedule",
            background: 1,
            width: "1/2"
          },
          {
            chartType: "pie",
            chartData: [
              { name: "Basic ($9.99)", value: 1250 },
              { name: "Pro ($24.99)", value: 890 },
              { name: "Enterprise ($49.99)", value: 340 }
            ],
            chartConfig: {
              dataKey: "value",
              nameKey: "name"
            },
            heading: "Pre-order Performance",
            subheading: "Orders by pricing tier",
            description: "Pro plan showing strong adoption with highest revenue contribution",
            background: 4,
            width: "1/2"
          }
        ]
      },
      {
        type: "markdown",
        content: [
          {
            content: "## Launch Strategy\n\n### Phase 1: Soft Launch (March 15-31)\n- Beta testing with 500 selected customers\n- Gather feedback and fix critical issues\n- Refine onboarding process\n\n### Phase 2: Public Launch (April 1-15)\n- Full marketing campaign activation\n- Press release and media outreach\n- Influencer partnerships\n- Launch event webinar\n\n### Phase 3: Scale (April 16-30)\n- Monitor performance metrics\n- Optimize based on user feedback\n- Expand to international markets",
            background: 1,
            width: "1/2"
          },
          {
            content: "## Success Metrics\n\n### 30-Day Targets\n- **10,000 new subscribers**\n- **$500K in revenue**\n- **4.5+ star rating**\n- **< 2% churn rate**\n\n### 90-Day Targets\n- **50,000 subscribers**\n- **$2.5M in revenue**\n- **15% market share**\n- **Partnership with 3 major integrations**\n\n### Risk Mitigation\n- Competitor response plan ready\n- Technical support team scaled up\n- Legal compliance verified",
            background: 3,
            width: "1/2"
          }
        ]
      },
      {
        type: "marquee",
        content: [
          {
            content: ["Team Ready", "Systems Tested", "Let's Launch!"],
            background: 6
          }
        ]
      }
    ],
    createdAt: new Date("2024-03-01T11:00:00Z"),
    updatedAt: new Date("2024-03-15T14:20:00Z")
  },

  "team-retrospective": {
    id: "team-retrospective",
    title: "Sprint 24 - Team Retrospective",
    color: "orange",
    content: [
      {
        type: "marquee",
        content: [
          {
            content: ["Sprint Complete", "Lessons Learned", "Forward Together"],
            background: 1
          }
        ]
      },
      {
        type: "markdown",
        content: [
          {
            content: "# Sprint 24 Overview\n\n**Duration**: March 1-14, 2024 (2 weeks)\n**Team Size**: 8 developers, 2 designers, 1 product manager\n**Sprint Goal**: Implement user authentication system and improve dashboard performance\n\n## Sprint Achievements\n\n✅ **User Authentication System** - Completed ahead of schedule\n✅ **Dashboard Performance** - 40% improvement in load time\n✅ **Mobile Responsive Design** - All pages now mobile-friendly\n✅ **Bug Fixes** - 23 issues resolved\n\n## What We Missed\n\n❌ **Advanced Analytics** - Moved to next sprint\n❌ **Third-party Integrations** - Requires more research",
            background: 0,
            width: "1/1"
          }
        ]
      },
      {
        type: "graph",
        content: [
          {
            chartType: "line",
            chartData: [
              { day: "Day 1", planned: 5, completed: 3, bugs: 1 },
              { day: "Day 2", planned: 10, completed: 8, bugs: 2 },
              { day: "Day 3", planned: 15, completed: 12, bugs: 3 },
              { day: "Day 4", planned: 20, completed: 18, bugs: 4 },
              { day: "Day 5", planned: 25, completed: 23, bugs: 6 },
              { day: "Day 6", planned: 30, completed: 28, bugs: 8 },
              { day: "Day 7", planned: 35, completed: 33, bugs: 10 },
              { day: "Day 8", planned: 40, completed: 38, bugs: 12 },
              { day: "Day 9", planned: 45, completed: 43, bugs: 15 },
              { day: "Day 10", planned: 50, completed: 48, bugs: 18 }
            ],
            chartConfig: {
              xAxisKey: "day"
            },
            heading: "Sprint Burndown Chart",
            subheading: "Daily progress tracking",
            description: "Steady progress with 96% completion rate and proactive bug fixing",
            background: 1,
            width: "1/1"
          }
        ]
      },
      {
        type: "markdown",
        content: [
          {
            content: "## What Went Well 👍\n\n### Team Collaboration\n- Daily standups were focused and efficient\n- Pair programming sessions increased code quality\n- Cross-team communication improved significantly\n\n### Technical Achievements\n- Clean code practices adopted by all developers\n- Automated testing coverage increased to 85%\n- Documentation kept up-to-date throughout sprint\n\n### Process Improvements\n- Estimation accuracy improved by 20%\n- Code review turnaround time reduced to 4 hours\n- Design handoff process streamlined",
            background: 1,
            width: "1/2"
          },
          {
            content: "## What Could Improve 🔄\n\n### Challenges Faced\n- Third-party API documentation was incomplete\n- Some user stories were under-estimated\n- Testing environment had intermittent issues\n\n### Action Items for Next Sprint\n- [ ] Research alternative APIs for integrations\n- [ ] Improve story estimation with historical data\n- [ ] Set up dedicated testing environment\n- [ ] Schedule design review earlier in sprint\n- [ ] Implement better error handling patterns",
            background: 3,
            width: "1/2"
          }
        ]
      },
      {
        type: "graph",
        content: [
          {
            chartType: "area",
            chartData: [
              { sprint: "Sprint 20", velocity: 42, quality: 7.2, satisfaction: 6.8 },
              { sprint: "Sprint 21", velocity: 45, quality: 7.5, satisfaction: 7.2 },
              { sprint: "Sprint 22", velocity: 48, quality: 7.8, satisfaction: 7.5 },
              { sprint: "Sprint 23", velocity: 44, quality: 8.1, satisfaction: 7.8 },
              { sprint: "Sprint 24", velocity: 48, quality: 8.4, satisfaction: 8.2 }
            ],
            chartConfig: {
              xAxisKey: "sprint"
            },
            heading: "Team Performance Trends",
            subheading: "Velocity (story points), Quality (1-10), Satisfaction (1-10)",
            description: "Consistent improvement across all metrics with Sprint 24 showing highest satisfaction",
            background: 3,
            width: "1/1"
          }
        ]
      },
      {
        type: "marquee",
        content: [
          {
            content: ["Great Work Team!", "Sprint 25 Starts Tomorrow", "Keep Improving!"],
            background: 4
          }
        ]
      }
    ],
    createdAt: new Date("2024-03-14T16:00:00Z"),
    updatedAt: new Date("2024-03-14T17:30:00Z")
  }
};

// Helper function to get a sample note by slug
export function getSampleNote(slug: string): Note | null {
  return sampleNotes[slug] || null;
}

// Helper function to get all sample note slugs
export function getSampleNoteSlugs(): string[] {
  return Object.keys(sampleNotes);
} 
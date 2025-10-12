---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge code migration assistant for framework upgrades, version migrations, and codebase transformations.
---

# ClaudeForge Migration Helper

ClaudeForge intelligent migration system that automates complex framework upgrades, version migrations, and codebase transformations with comprehensive AST analysis, automated codemods, and risk-free migration strategies.

## Purpose

Transform framework and version migrations from risky manual refactoring to intelligent, automated processes that ensure code quality, backward compatibility, and minimal downtime across large-scale codebases.

## Features

- **Framework Migration**: Automated migration between frameworks (React, Vue, Angular, etc.)
- **Version Upgrades**: Intelligent version upgrade paths with breaking change detection
- **Codemod Generation**: Custom codemod creation using AST transformations
- **Breaking Change Analysis**: Comprehensive detection of breaking changes and deprecations
- **Migration Planning**: Risk assessment and phased migration strategy generation
- **Rollback Support**: Automated rollback procedures with version control integration
- **Testing Integration**: Automated test generation and validation during migration
- **Documentation**: Migration guides and change logs with team communication templates

## Usage

```bash
/migration-helper [migration-type] [options]
```

Target: $ARGUMENTS (if specified, otherwise analyze current project)

### Migration Commands

**Framework Version Upgrade:**
```bash
/migration-helper upgrade --framework=react --from=16.8 --to=18.2
```
Performs comprehensive version upgrade including:
- Breaking change detection and analysis
- Deprecated API identification and replacement
- New feature adoption recommendations
- Package.json dependency updates
- Lock file regeneration
- Migration script generation with rollback support

**Framework Migration:**
```bash
/migration-helper migrate --from=vue2 --to=react --strategy=incremental
```
Migrates between frameworks with:
- Component structure transformation
- State management migration (Vuex → Redux/Context)
- Template syntax to JSX conversion
- Lifecycle method mapping
- Router configuration migration
- Build tool configuration updates

**Library Replacement:**
```bash
/migration-helper replace --library=moment --with=date-fns --preserve-behavior
```
Replaces libraries maintaining behavior:
- API usage pattern detection
- Automated code transformation
- Test case updates
- Import statement rewriting
- Type definition updates
- Behavior validation tests

### Codemod Operations

**Custom Codemod Generation:**
```bash
/migration-helper codemod --pattern="class components" --transform="functional" --scope=src/
```
Generates and applies codemods with:
- AST-based pattern matching
- Safe transformation rules
- Dry-run preview with diff output
- Selective file application
- Transformation validation
- Rollback checkpoints

**AST Transformation:**
```bash
/migration-helper transform --ast-query="CallExpression[callee.name='require']" --replace-with="import"
```
Performs AST-level transformations:
- Complex syntax tree queries
- Multi-file transformations
- Scope-aware replacements
- Type-safe transformations
- Formatting preservation
- Comment retention

**Breaking Change Detection:**
```bash
/migration-helper analyze --version-from=3.0 --version-to=4.0 --report=detailed
```
Analyzes breaking changes with:
- API signature change detection
- Deprecated feature usage scanning
- Type incompatibility identification
- Runtime behavior changes
- Configuration format changes
- Impact severity assessment

### Migration Strategies

**Incremental Migration:**
```bash
/migration-helper plan --strategy=incremental --duration=4-weeks --risk-level=low
```
Creates phased migration plan with:
- Module-by-module migration sequence
- Dual-version compatibility layer
- Feature flag integration
- Progressive rollout timeline
- Risk mitigation strategies
- Team coordination schedule

**Big Bang Migration:**
```bash
/migration-helper plan --strategy=big-bang --cutover-date=2024-03-15 --backup-plan
```
Plans complete migration with:
- Comprehensive preparation checklist
- Parallel environment setup
- Cutover procedure documentation
- Rollback decision criteria
- Post-migration validation
- Emergency response procedures

**Strangler Fig Pattern:**
```bash
/migration-helper strangler --routes-first --proxy-config --parallel-run
```
Implements strangler fig migration:
- Route-level migration strategy
- Proxy configuration for dual systems
- Parallel execution with comparison
- Gradual traffic shifting
- Legacy system decommissioning plan
- Data synchronization strategy

## Migration Methodologies

### React Migration Patterns

**Class to Functional Components:**
```javascript
// Before: Class component with lifecycle
class UserProfile extends React.Component {
  state = { user: null, loading: true };

  componentDidMount() {
    this.fetchUser(this.props.userId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      this.fetchUser(this.props.userId);
    }
  }

  fetchUser = async (userId) => {
    const user = await api.getUser(userId);
    this.setState({ user, loading: false });
  };

  render() {
    return this.state.loading ? <Spinner /> : <User data={this.state.user} />;
  }
}

// After: Functional component with hooks
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      const userData = await api.getUser(userId);
      if (!cancelled) {
        setUser(userData);
        setLoading(false);
      }
    }

    fetchUser();
    return () => { cancelled = true; };
  }, [userId]);

  return loading ? <Spinner /> : <User data={user} />;
}
```

**Context API Migration:**
```javascript
// Legacy Context API
const ThemeContext = React.createContext();

class ThemeProvider extends React.Component {
  static childContextTypes = {
    theme: PropTypes.object
  };

  getChildContext() {
    return { theme: this.props.theme };
  }
}

// Modern Context API
const ThemeContext = React.createContext();

function ThemeProvider({ children, theme }) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme must be used within ThemeProvider');
  return theme;
}
```

### Vue Migration Patterns

**Vue 2 to Vue 3 Composition API:**
```javascript
// Vue 2 Options API
export default {
  data() {
    return {
      count: 0,
      user: null
    };
  },

  computed: {
    doubleCount() {
      return this.count * 2;
    }
  },

  methods: {
    increment() {
      this.count++;
    }
  },

  async mounted() {
    this.user = await api.fetchUser();
  }
};

// Vue 3 Composition API
import { ref, computed, onMounted } from 'vue';

export default {
  setup() {
    const count = ref(0);
    const user = ref(null);

    const doubleCount = computed(() => count.value * 2);

    function increment() {
      count.value++;
    }

    onMounted(async () => {
      user.value = await api.fetchUser();
    });

    return { count, user, doubleCount, increment };
  }
};
```

### Angular Migration Patterns

**AngularJS to Angular:**
```typescript
// AngularJS Controller
angular.module('app').controller('UserController', function($scope, UserService) {
  $scope.users = [];

  UserService.getUsers().then(function(users) {
    $scope.users = users;
  });

  $scope.deleteUser = function(userId) {
    UserService.delete(userId).then(function() {
      $scope.users = $scope.users.filter(u => u.id !== userId);
    });
  };
});

// Angular Component
@Component({
  selector: 'app-user-list',
  template: `
    <div *ngFor="let user of users$ | async">
      {{ user.name }}
      <button (click)="deleteUser(user.id)">Delete</button>
    </div>
  `
})
export class UserListComponent implements OnInit {
  users$: Observable<User[]>;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.users$ = this.userService.getUsers();
  }

  deleteUser(userId: string) {
    this.userService.delete(userId).pipe(
      switchMap(() => this.userService.getUsers())
    ).subscribe(users => this.users$ = of(users));
  }
}
```

## Codemod Tools Integration

### jscodeshift Usage

**Custom Codemod Example:**
```javascript
// transform-class-to-hooks.js
module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Find class components
  root.find(j.ClassDeclaration, {
    superClass: {
      type: 'MemberExpression',
      object: { name: 'React' },
      property: { name: 'Component' }
    }
  }).forEach(path => {
    const componentName = path.value.id.name;

    // Extract state
    const stateProperties = extractState(path);

    // Extract lifecycle methods
    const effects = extractEffects(path);

    // Generate functional component
    const functionalComponent = buildFunctionalComponent(
      componentName,
      stateProperties,
      effects
    );

    j(path).replaceWith(functionalComponent);
  });

  return root.toSource({ quote: 'single' });
};
```

**Running Codemods:**
```bash
# Apply transformation
npx jscodeshift -t transform-class-to-hooks.js src/components

# Dry run to preview changes
npx jscodeshift -t transform.js src/ --dry --print

# Transform with TypeScript parser
npx jscodeshift -t transform.js src/ --parser=tsx
```

### ts-migrate Integration

**TypeScript Migration:**
```bash
# Initialize TypeScript migration
npx ts-migrate init

# Add TypeScript configs
npx ts-migrate-server --config-file tsconfig.json

# Rename files to .ts/.tsx
npx ts-migrate rename src/

# Add @ts-expect-error comments
npx ts-migrate migrate src/

# Run type checking and fix
npx tsc --noEmit && npx ts-migrate reignore src/
```

### AST Explorer Integration

**Interactive Transformation Development:**
- Real-time AST visualization at astexplorer.net
- Test transformations before production use
- Support for multiple parsers (babel, typescript, flow)
- jscodeshift template generation
- Share transformations with team

## Migration Planning Framework

### Risk Assessment Matrix

**Risk Categories:**
```
High Risk:
- Breaking changes in core dependencies
- Major framework version jumps (e.g., React 16 → 18)
- Database schema migrations
- Authentication/security changes
- Payment processing updates

Medium Risk:
- Minor version upgrades with deprecations
- State management library changes
- Build tool migrations
- UI library updates
- Testing framework changes

Low Risk:
- Patch version updates
- Development dependency updates
- Code style/linting changes
- Documentation updates
- Internal utility refactoring
```

### Migration Checklist

**Pre-Migration Phase:**
- [ ] Comprehensive test coverage (minimum 80%)
- [ ] Feature freeze on affected modules
- [ ] Full database backup and restore test
- [ ] Dependency audit and vulnerability scan
- [ ] Performance baseline measurements
- [ ] Rollback procedure documentation
- [ ] Team training and knowledge transfer
- [ ] Communication plan to stakeholders

**Migration Phase:**
- [ ] Branch protection and code freeze
- [ ] Automated migration script execution
- [ ] Incremental commit strategy
- [ ] Continuous integration pipeline validation
- [ ] Manual QA testing of critical paths
- [ ] Performance regression testing
- [ ] Security vulnerability scanning
- [ ] Documentation updates

**Post-Migration Phase:**
- [ ] Production deployment with canary release
- [ ] Real-time monitoring and alerting
- [ ] User acceptance testing
- [ ] Performance comparison with baseline
- [ ] Legacy code cleanup
- [ ] Post-mortem and lessons learned
- [ ] Knowledge base article creation
- [ ] Celebration of successful migration

## Testing Strategy

### Automated Testing

**Migration Test Suite:**
```javascript
describe('Migration: Class to Hooks', () => {
  it('preserves component behavior', () => {
    const { container: before } = render(<ClassComponent />);
    const { container: after } = render(<HooksComponent />);
    expect(before.innerHTML).toBe(after.innerHTML);
  });

  it('maintains state management', () => {
    const { getByText } = render(<HooksComponent />);
    fireEvent.click(getByText('Increment'));
    expect(getByText('Count: 1')).toBeInTheDocument();
  });

  it('handles lifecycle equivalents', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ data: 'test' });
    render(<HooksComponent fetch={fetchMock} />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });
});
```

**Visual Regression Testing:**
```javascript
// Chromatic integration
describe('Visual Regression', () => {
  it('matches previous component appearance', async () => {
    await page.goto('http://localhost:6006/iframe.html?id=migrated-component');
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchImageSnapshot({
      failureThreshold: 0.01,
      failureThresholdType: 'percent'
    });
  });
});
```

### Manual Testing Guides

**Critical Path Testing:**
```markdown
## User Authentication Flow
1. Navigate to login page
2. Enter valid credentials
3. Verify redirect to dashboard
4. Check user profile information
5. Test logout functionality

## Payment Processing
1. Add items to cart
2. Proceed to checkout
3. Enter payment information
4. Verify payment confirmation
5. Check order history

## Data Export Feature
1. Navigate to export page
2. Select date range
3. Choose export format
4. Download file
5. Verify file contents
```

## CI/CD Integration

### GitHub Actions Migration Workflow

```yaml
name: Framework Migration

on:
  workflow_dispatch:
    inputs:
      migration_type:
        description: 'Migration type'
        required: true
        type: choice
        options:
          - react-upgrade
          - vue-migration
          - angular-update

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Create migration branch
        run: |
          git checkout -b migration/${{ github.event.inputs.migration_type }}-$(date +%Y%m%d)

      - name: Install dependencies
        run: npm ci

      - name: Run migration scripts
        run: npm run migrate:${{ github.event.inputs.migration_type }}

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build

      - name: Commit changes
        run: |
          git config user.name "Migration Bot"
          git config user.email "bot@example.com"
          git add .
          git commit -m "chore: automated migration - ${{ github.event.inputs.migration_type }}"

      - name: Create pull request
        uses: peter-evans/create-pull-request@v5
        with:
          title: "Migration: ${{ github.event.inputs.migration_type }}"
          body: |
            ## Automated Migration

            Migration type: ${{ github.event.inputs.migration_type }}
            Date: $(date)

            ### Changes
            - Framework/library updates
            - Code transformations via codemods
            - Test suite updates

            ### Testing Required
            - [ ] Unit tests pass
            - [ ] Integration tests pass
            - [ ] Manual QA complete
            - [ ] Performance benchmarks reviewed
          branch: migration/${{ github.event.inputs.migration_type }}-$(date +%Y%m%d)
```

---

**ClaudeForge Migration Helper** - Intelligent framework migration with automated codemods, comprehensive testing, and risk-free transformation strategies for modern development teams.

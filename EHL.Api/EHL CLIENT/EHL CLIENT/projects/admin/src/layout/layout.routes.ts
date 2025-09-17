import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from 'projects/shared/src/guards/auth-guard';

export const routes: Routes = [
  {
      path:'',
      component:LayoutComponent,
      children:[
            {
              path: '',
              redirectTo: 'emer',
              pathMatch:'full'

            },
            {
              path: 'attribute',
              loadComponent: () => import('./attribute/attribute.component').then(m => m.AttributeComponent),
              canActivate: [AuthGuard],
            },
            {
              path: 'feedback',
              loadComponent: () => import('./feedback/feedback.component').then(m => m.FeedbackComponent),
              canActivate: [AuthGuard],
            },
            {
              path: 'emer',
              loadComponent: () => import('./emer/emer-list/emer-list.component').then(m => m.EmerListComponent),
            },
            {
              path: 'Oil',
              loadComponent: () => import('./oil/oil.component').then(m => m.OilComponent),
            },
            {
              path: 'mrls-distr',
              loadComponent: () => import('./mrls-dist-list/mrls-dist.component').then(m =>m.MrlsDistComponent),
            },
            {
              path: 'tech-manual',
              loadComponent: () => import('./policy/tech-manuals/tech-manuals/tech-manuals.component').then(m => m.TechManualsComponent),
            },
            {
              path: 'policy',
              loadComponent: () => import('./policy/policies/policies-list/policies.component').then(m => m.PoliciesComponent),
            },
            {
              path: 'ispl',
              loadComponent: () => import('./policy/ispl/ispl.component').then(m => m.IsplComponent),
            },
            {
              path: 'role-of-mag',
              loadComponent: () => import('./roleofmag/role-of-mag-list/role-of-mag-list.component').then(m => m.RoleOfMagListComponent),
            },
            {
              path: 'master-sheet',
              loadComponent: () => import('./master-sheet/master-sheet.component').then(m => m.MasterSheetComponent),
            },
            {
              path: 'wing',
              loadComponent: () => import('./wing-list/wing-list.component').then(m => m.WingListComponent),
            },
            {
              path: 'ep-contract',
              loadComponent: () => import('./ep-contract/ep-contract-list/ep-contract-list.component').then(m => m.EpContractListComponent),
            },
            {
              path: 'Confidential',
              loadComponent: () => import('../layout/emer/emer-confidential/emer-confidential.component').then(m => m.EmerConfidentialComponent),
            },
            {
              path: 'technical-ao/ai',
              loadComponent: () => import('./techincal-ao-ai/techincal-ao-ai.component').then(m => m.TechincalAoAiComponent),
            },
            {
              path: 'defect-report',
              loadComponent: () => import('./defect-report/defect-report.component').then(m => m.DefectReportComponent),
            },
            {
              path: 'emer-index',
              loadComponent: () => import('./emer/emer-index/emer-index.component').then(m => m.EmerIndexComponent),
            },
            {
              path: 'eqpt-mgrs',
              loadComponent: () => import('./eqpt-mgrs/eqpt-mgrs.component').then(m => m.EqptMgrsComponent),
            },
            {
              path: 'eqpt-appreciation',
              loadComponent: () => import('./eqpt-appreciation/eqpt-appreciation.component').then(m => m.EqptAppreciationComponent),
            },
            {
              path: 'smte/ste-distr',
              loadComponent: () => import('./smte-ste-distr/smte-ste-distr.component').then(m => m.SmteSteDistrComponent)
            },
            {
              path: 'drone-induction-list',
              loadComponent: () => import('./drone/drone-induction-list/drone-induction-list.component').then(m => m.DroneInductionListComponent),
            },
            {
              path: 'isppl-list',
              loadComponent: () => import('./lcsc/isppl-list/isppl-list.component').then(m => m.IspplListComponent),
            }
      ]
  }
]

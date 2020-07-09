import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  EmbeddedViewRef,
  Inject,
  Input,
  TemplateRef,
  ViewContainerRef,
  ɵstringify as stringify,
} from '@angular/core';
import { ResultState } from './stateful';
import {
  StatefulConfig,
  StatefulConfigProvider
} from './providers';
import { DefaultLoaderComponent } from './components/default-loader/default-loader.component';
import { DefaultErrorComponent } from './components/default-error/default-error.component';

/**
 * A structural directive that renders template depending on result state: isLoading / error / result
 * When isLoading - loaderTpl or provided Loader component is used
 * When error - errorTpl or provided Error component is used
 * Else(when result) - templateRef if rendered
 *
 * @usage
 * Different ways to use directive: {resultState} is object of type ResultState<R, E>
 * `*ngUtilsStateful="{resultState}"`, is generally used
 * `*ngUtilsStateful="{resultStateAsync} | async as resultState"`, is generally used
 * `*ngUtilsStateful="{resultStateAsync} | async; let resultStateOrAnyName"`, implicit ResultState
 * `*ngUtilsStateful="{resultState}; loaderTpl loader"; errorTpl error`, to use with templateRefs
 * `*ngUtilsStateful="{resultState}; result as resultValue; isLoading as isLoadingValue; error as errorValue"`, for direct access
 *
 * @ngModule StatefulModule
 * @publicApi
 */
@Directive({
  selector: '[ngUtilsStateful]'
})
export class NgUtilsStateful<R = unknown, E = unknown> { // todo: check typings; works like this
  private _context: NgUtilsStatefulContext<R, E> = new NgUtilsStatefulContext<R, E>();
  private _loaderTplTemplateRef: TemplateRef<NgUtilsStatefulContext<R, E>> | null = null;
  private _errorTplTemplateRef: TemplateRef<NgUtilsStatefulContext<R, E>> | null = null;
  private _error: EmbeddedViewRef<NgUtilsStatefulContext<R, E>> | ComponentRef<any> | null = null; // todo
  private _loader: EmbeddedViewRef<NgUtilsStatefulContext<R, E>> | ComponentRef<any> | null = null; // todo

  constructor(
    private _resolver: ComponentFactoryResolver,
    private _viewContainer: ViewContainerRef,
    private _templateRef: TemplateRef<NgUtilsStatefulContext<R, E>>,
    @Inject(StatefulConfigProvider) private config: StatefulConfig,
  ) {}

  /**
   * The expression to evaluate what state is "current".
   */
  @Input()
  set ngUtilsStateful(resultState: ResultState<R, E>) {
    assertInput(resultState);
    this._context.$implicit = resultState;
    this._context.isLoading = resultState.isLoading;
    this._context.error = resultState.error;
    this._context.result = resultState.result;
    this._updateView();
  }

  /**
   * A loader template
   */
  @Input()
  set ngUtilsStatefulLoaderTpl(templateRef: TemplateRef<NgUtilsStatefulContext<R, E>> | null) {
    assertTemplate('ngUtilsStatefulLoaderTpl', templateRef);
    this._loaderTplTemplateRef = templateRef;
    this._loader = null;  // clear previous view if any.
    this._updateView();
  }

  /**
   * An error template
   */
  @Input()
  set ngUtilsStatefulErrorTpl(templateRef: TemplateRef<NgUtilsStatefulContext<R, E>> | null) {
    assertTemplate('ngUtilsStatefulErrorTpl', templateRef);
    this._errorTplTemplateRef = templateRef;
    this._error = null;  // clear previous view if any.
    this._updateView();
  }

  private _updateView() {
    if (this._context.$implicit.isLoading) {
      if (!this._loader) {
        this._viewContainer.clear();
        this._error = null;

        this._loader = this._loaderTplTemplateRef
          ? this._viewContainer.createEmbeddedView(this._loaderTplTemplateRef, this._context)
          : this._viewContainer.createComponent(
            this._resolver.resolveComponentFactory(this.config.loaderComponent || DefaultLoaderComponent as any) // todo: check
          );
      }
    } else if (this._context.$implicit.error) {
      if (!this._error) {
        this._viewContainer.clear();
        this._loader = null;

        this._error = this._errorTplTemplateRef
          ? this._viewContainer.createEmbeddedView(this._errorTplTemplateRef, this._context)
          : this._viewContainer.createComponent(
            this._resolver.resolveComponentFactory(this.config.errorComponent || DefaultErrorComponent as any) // todo: check
          );
      }
    } else {
      this._loader = null;
      this._error = null;
      this._viewContainer.clear();
      this._viewContainer.createEmbeddedView(this._templateRef, this._context);
    }
  }
}

/**
 * @publicApi
 */
export class NgUtilsStatefulContext<R = unknown, E = unknown> implements ResultState<R, E> {
  public $implicit: ResultState<R, E> = null;
  public isLoading: boolean = null;
  public error: E = null;
  public result: R = null;
}

function assertInput(resultState: ResultState): void {
  const isResultState = typeof resultState === 'object'
    && resultState.isLoading !== undefined
    && resultState.error !== undefined
    && resultState.result !== undefined;

  if (!isResultState) {
    throw new Error(`Input must be a ResultState(isLoader/error/result should not be 'undefined'('null' is allowed)),
    but received ${stringify(resultState)}.`);
  }
}

function assertTemplate(property: string, templateRef: TemplateRef<any> | null): void {
  const isTemplateRefOrNull = !!(!templateRef || templateRef.createEmbeddedView);
  if (!isTemplateRefOrNull) {
    throw new Error(`${property} must be a TemplateRef, but received '${stringify(templateRef)}'.`);
  }
}

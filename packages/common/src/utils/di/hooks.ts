/**
 * Function called by the injector right after the injectable class is
 * instanced that may be implemented by any injetable class.
 * Useful for abstract classes that need to access the child class properties
 * before it's provided to the developer, which isn't possible to do from
 * constructor.
 */
export const HookAfterConstructed = Symbol('HookAfterConstructed');

/**
 * Function called by the injector right before the injectable class is
 * instanced.
 * @see HookAfterConstructed
 */
export const HookBeforeConstructed = Symbol('HookBeforeConstructed');

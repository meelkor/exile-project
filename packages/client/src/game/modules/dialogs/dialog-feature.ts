import { Component } from '@exile/client/engine/component/component';
import { Pos } from '@exile/common/types/geometry';

export abstract class DialogFeature extends Component {

    public offset?: Pos;
}

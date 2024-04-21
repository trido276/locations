import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity()
class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  public locationName: string;

  @Column()
  public locationShortName: string;

  @Column()
  public locationNumber: string;

  @Column()
  public area: number;

  @OneToMany(() => Location, childLocation => childLocation.parent)
  child: Location[]

  @ManyToOne(() => Location, parentLocation => parentLocation.child)
  @JoinColumn()
  parent: Location

  /**
   * parse_to_location_entity
   */
  public parse_to_location(other_object: object): void {
    //TODO: handle error
    for (let key in other_object) {
      this[key] = other_object[key]
    }
  }

  public toString(): string {
    return `{locationName: ${this.locationName}, locationShortName:${this.locationShortName}, area:${this.area}}`
  }
}


export default Location;
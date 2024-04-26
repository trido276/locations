import { Logger } from "@nestjs/common";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";

@Entity()
class Location extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
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
  parent: Location

  /**
   * Parse Object to Location entity
   */
  public parse(other_object: object): void {
    for (let key in other_object) {
      this[key] = other_object[key]
    }
  }

  public toString(): string {
    return `{locationName: ${this.locationName}, locationShortName:${this.locationShortName}, area:${this.area}}`
  }
}


export default Location;